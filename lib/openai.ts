import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Lazy initialization using Proxy to defer client creation until first use
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    if (!globalForOpenAI.openai) {
      globalForOpenAI.openai = createOpenAIClient();
    }
    return (globalForOpenAI.openai as unknown as Record<string, unknown>)[prop as string];
  },
});

export default openai;

// Model configurations
export const MODELS = {
  // Fast, cost-effective for most tasks
  GPT4O_MINI: "gpt-4o-mini",
  // High quality, balanced speed/quality
  GPT4O: "gpt-4o",
  // Complex reasoning (premium)
  O1_PREVIEW: "o1-preview",
  // Default model for document analysis
  DEFAULT: "gpt-4o",
} as const;

export type ModelType = (typeof MODELS)[keyof typeof MODELS];

// System prompts
export const SYSTEM_PROMPTS = {
  DOCUMENT_ANALYST: `You are an intelligent document analysis assistant. Your role is to:
1. Analyze and understand uploaded documents thoroughly
2. Answer questions about the document content accurately
3. Summarize key points when asked
4. Extract specific information as requested
5. Maintain context from previous messages in the conversation

Always be helpful, accurate, and provide clear, well-structured responses.
If you're unsure about something, say so rather than making up information.`,
} as const;
