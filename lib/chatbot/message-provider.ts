import type {
  Category,
  FaqAnswer,
  FaqQuestion,
  Subcategory,
} from "./types";

/**
 * Abstraction for how the chatbot resolves user intents.
 * FAQ implementation today; swap or compose with AiMessageProvider later.
 */
export interface MessageProvider {
  getCategories(): Promise<Category[]>;
  getSubcategories(categoryId: string): Promise<Subcategory[]>;
  getQuestions(subcategoryId: string): Promise<FaqQuestion[]>;
  getAnswer(faqId: string): Promise<FaqAnswer>;
}
