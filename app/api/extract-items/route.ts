import { NextResponse } from "next/server"
import { getExtractModel, getOpenAIClient } from "@/lib/llm"
import { z } from "zod"

export const runtime = "nodejs"

const CATEGORIES = [
  "sofa_cover",
  "rug",
  "coffee_table",
  "side_table",
  "ceiling_light",
  "floor_lamp",
  "curtain",
  "wall_art",
  "pillows_throw",
  "decor_plants",
] as const

const ItemSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().min(1),
  spec: z.string().min(1),
  tips: z.string().min(1),
  search_terms: z.object({
    tmall: z.string().min(1),
    jd: z.string().min(1),
    pdd: z.string().min(1),
  }),
})

const ItemsSchema = z.array(ItemSchema).min(1)

function extractText(message: unknown): string {
  if (!message || typeof message !== "object") return ""
  const content = (message as any).content as unknown
  if (typeof content === "string") return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part || typeof part !== "object") return ""
        if ((part as any).type === "text" && typeof (part as any).text === "string") return (part as any).text
        return ""
      })
      .filter(Boolean)
      .join("\n")
  }
  return ""
}

function stripCodeFences(s: string) {
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim()
}

function extractFirstJsonCandidate(s: string): string {
  const text = stripCodeFences(s)

  // Prefer a raw array: [...]
  const arrayStart = text.indexOf("[")
  if (arrayStart !== -1) {
    const arrayEnd = text.lastIndexOf("]")
    if (arrayEnd !== -1 && arrayEnd > arrayStart) return text.slice(arrayStart, arrayEnd + 1)
  }

  // Or an object that wraps items: { "items": [...] }
  const objStart = text.indexOf("{")
  if (objStart !== -1) {
    const objEnd = text.lastIndexOf("}")
    if (objEnd !== -1 && objEnd > objStart) return text.slice(objStart, objEnd + 1)
  }

  return text
}

function parseItemsFromText(raw: string): unknown {
  const candidate = extractFirstJsonCandidate(raw)
  const parsed = JSON.parse(candidate)
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).items)) return (parsed as any).items
  return parsed
}

const PROMPT = `
你是软装清单生成器。请根据图片内容，输出一个 JSON 数组（不要输出任何解释，不要 Markdown，不要代码块）。
每个元素必须严格为：
{
  "category": "sofa_cover|rug|coffee_table|side_table|ceiling_light|floor_lamp|curtain|wall_art|pillows_throw|decor_plants",
  "title": string,
  "spec": string,
  "tips": string,
  "search_terms": { "tmall": string, "jd": string, "pdd": string }
}

要求：
1) 必须输出至少 8 个 item，尽量覆盖 10 个 category。
2) search_terms 是“可用于搜索的中文关键词串”，不是链接；尽量包含：风格词（奶油风/法式奶油风等）、核心品类、颜色、材质、尺寸等。
3) 不要编造品牌/型号；不确定就用通用描述。
4) 全部用中文。
`.trim()

export async function POST(request: Request) {
  let openai: ReturnType<typeof getOpenAIClient>
  try {
    openai = getOpenAIClient()
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "缺少 LLM 配置"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  try {
    const body = (await request.json().catch(() => null)) as null | { imageUrl?: string }
    const imageUrl = body?.imageUrl

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "缺少 imageUrl" }, { status: 400 })
    }

    const payload: any = {
      model: getExtractModel(),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }

    const completion = await openai.chat.completions.create(payload)
    const message = completion.choices?.[0]?.message
    const rawText = extractText(message)

    let itemsUnknown: unknown
    try {
      itemsUnknown = parseItemsFromText(rawText)
    } catch {
      itemsUnknown = null
    }

    const validated = ItemsSchema.safeParse(itemsUnknown)
    if (validated.success) {
      return NextResponse.json({ items: validated.data })
    }

    // Ask the model to repair to the exact schema (JSON only)
    const repairPayload: any = {
      model: getExtractModel(),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "请把下面内容修复为“严格合法的 JSON 数组”，并且每个元素都必须包含：category/title/spec/tips/search_terms(tmall/jd/pdd)。只输出 JSON，不要解释。\n\n原始输出：\n" +
                rawText,
            },
          ],
        },
      ],
    }
    const repaired = await openai.chat.completions.create(repairPayload)
    const repairedText = extractText(repaired.choices?.[0]?.message)

    let repairedUnknown: unknown
    try {
      repairedUnknown = parseItemsFromText(repairedText)
    } catch {
      repairedUnknown = null
    }

    const validated2 = ItemsSchema.safeParse(repairedUnknown)
    if (!validated2.success) {
      return NextResponse.json(
        {
          error: "未能生成符合项目格式的软装 JSON",
          debug: {
            issues: validated2.error.issues,
            rawText,
            repairedText,
          },
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ items: validated2.data })
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "提取失败"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
