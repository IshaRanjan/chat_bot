import type { MessageProvider } from "./message-provider";
import type {
  Category,
  FaqAnswer,
  FaqQuestion,
  Subcategory,
} from "./types";

/**
 * Placeholder for a future AI-backed provider.
 * Implement streamChat(), intent detection, and RAG over FAQs here.
 * Compose with FaqApiClient for hybrid FAQ + AI flows.
 */
export class AiMessageProviderStub implements MessageProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options?: { apiRoute?: string }) {}

  async getCategories(): Promise<Category[]> {
    throw new Error("AI provider not configured. Use FaqApiClient.");
  }

  async getSubcategories(_categoryId: string): Promise<Subcategory[]> {
    throw new Error("AI provider not configured.");
  }

  async getQuestions(_subcategoryId: string): Promise<FaqQuestion[]> {
    throw new Error("AI provider not configured.");
  }

  async getAnswer(_faqId: string): Promise<FaqAnswer> {
    throw new Error("AI provider not configured.");
  }

  /** Future: POST /api/chat with streaming SSE */
  // async streamReply(messages: ChatMessage[]): Promise<AsyncIterable<string>> {}
}
