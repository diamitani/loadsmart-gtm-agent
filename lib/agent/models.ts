import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

export function getLanguageModel() {
  // 1. Google Gemini via @ai-sdk/google (Primary fast & multimodal choice)
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    });
    return google("gemini-2.5-flash");
  }

  // 2. Anthropic Claude via @ai-sdk/anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    return anthropic("claude-3-5-sonnet-latest");
  }

  // 3. OpenAI via @ai-sdk/openai
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    return openai("gpt-4o");
  }

  return null;
}
