/** Core domain types for the FAQ chatbot (shared by UI, API, and future AI layer). */

export type MessageRole = "user" | "bot" | "system";

export type ChatFlowStep =
  | "categories"
  | "subcategories"
  | "questions"
  | "answered";

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
}

export interface FaqQuestion {
  id: string;
  subcategory_id: string;
  question: string;
}

export interface FaqAnswer {
  id: string;
  subcategory_id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** Optional metadata for analytics or AI context later */
  meta?: {
    categoryId?: string;
    subcategoryId?: string;
    faqId?: string;
    flowStep?: ChatFlowStep;
  };
}

export interface ChatSelectionContext {
  category?: Category;
  subcategory?: Subcategory;
}

export interface ApiErrorBody {
  error: string;
}
