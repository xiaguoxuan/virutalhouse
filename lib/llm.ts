import OpenAI from "openai"

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0
}

export function getOpenAIClient() {
  const llmBaseURL = isNonEmptyString(process.env.LLM_BASE_URL) ? process.env.LLM_BASE_URL : null
  const llmApiKey = isNonEmptyString(process.env.LLM_API_KEY) ? process.env.LLM_API_KEY : null

  // Back-compat: if you haven't migrated, we still support OPENROUTER_API_KEY.
  const openRouterApiKey = isNonEmptyString(process.env.OPENROUTER_API_KEY) ? process.env.OPENROUTER_API_KEY : null

  let baseURL: string
  let apiKey: string

  if (llmApiKey) {
    baseURL = llmBaseURL || "https://openrouter.ai/api/v1"
    apiKey = llmApiKey
  } else {
    // If user explicitly points to a non-OpenRouter baseURL, we should not silently reuse an OpenRouter key.
    if (llmBaseURL && !llmBaseURL.includes("openrouter.ai")) {
      throw new Error("已配置 LLM_BASE_URL，但缺少 LLM_API_KEY；请在 .env.local 里配置")
    }

    if (!openRouterApiKey) {
      throw new Error("缺少 LLM_API_KEY（或 OPENROUTER_API_KEY）；请在 .env.local 里配置")
    }

    baseURL = llmBaseURL || "https://openrouter.ai/api/v1"
    apiKey = openRouterApiKey
  }

  // OpenRouter-specific optional headers; other providers may reject unknown headers.
  const defaultHeaders = baseURL.includes("openrouter.ai")
    ? {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_SITE_TITLE || "Soft Furnish AI",
      }
    : undefined

  return new OpenAI({ baseURL, apiKey, defaultHeaders })
}

export function getImageModel() {
  return process.env.LLM_IMAGE_MODEL || "google/gemini-2.5-flash-image"
}

export function getGenerateModel() {
  return process.env.LLM_GENERATE_MODEL || getImageModel()
}

export function getExtractModel() {
  // Extraction is text-only; allow a cheaper/faster text model.
  return process.env.LLM_EXTRACT_MODEL || process.env.LLM_TEXT_MODEL || getImageModel()
}
