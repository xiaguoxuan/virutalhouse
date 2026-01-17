import OpenAI from "openai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const PROMPT =
  "基于用户上传的真实房间照片，生成“奶油风”软装改造后的同角度照片。要求：保留原房间的户型结构、门窗位置、墙体与天花轮廓、地面走向与主要硬装不变；仅替换软装与表面材质的视觉效果（如墙面颜色、窗帘、地毯、沙发、茶几、灯具、装饰画、绿植、抱枕、床品等）。风格：奶油风（奶油白/米白/燕麦/浅驼/浅灰褐），低饱和、柔和、圆润线条、轻盈克制、干净整洁，有层次但不过度堆叠。光线：白天自然光，暖色温，柔和阴影，真实反射与质感。画面：写实摄影风格，真实比例，不夸张广角，不变形；细节清晰，高级但生活化。禁止：卡通/插画风、过度磨皮、强HDR、过锐化、夸张豪华欧式、赛博霓虹、结构改动、出现人物/文字/水印/logo。"

function extractFirstImageUrl(message: unknown): string | null {
  if (!message || typeof message !== "object") return null

  // OpenRouter image generation returns images on message.images
  const images = (message as any).images as unknown
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0] as any
    const url =
      first?.image_url?.url ||
      first?.imageUrl?.url || // some SDKs camelCase this field
      first?.url
    if (typeof url === "string" && url.length > 0) return url
  }

  const content = (message as any).content as unknown

  if (Array.isArray(content)) {
    for (const part of content) {
      if (!part || typeof part !== "object") continue
      if ((part as any).type === "image_url" && (part as any).image_url?.url) {
        return (part as any).image_url.url as string
      }
    }
    return null
  }

  if (typeof content === "string") {
    // Some providers may return a data URL inline in text.
    const match = content.match(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/)
    return match?.[0] ?? null
  }

  return null
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "缺少 OPENROUTER_API_KEY（请在 .env.local 里配置）" }, { status: 500 })
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_TITLE || "Soft Furnish AI",
    },
  })

  try {
    const form = await request.formData()
    const file = form.get("image")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "请上传图片（字段名：image）" }, { status: 400 })
    }

    const mime = file.type || "image/png"
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${mime};base64,${base64}`

    // OpenRouter supports `modalities`/`image_config` for Gemini image models,
    // but the OpenAI SDK types don't include them yet.
    const payload: any = {
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      image_config: {
        aspect_ratio: "4:3",
        image_size: "1K",
      },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }

    const completion = await openai.chat.completions.create(payload)

    const message = completion.choices?.[0]?.message
    const imageUrl = extractFirstImageUrl(message)

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "未从模型返回中解析到图片",
          debug: { message },
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "生成失败"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
