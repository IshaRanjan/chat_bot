import type {
  ApiErrorBody,
  Category,
  FaqAnswer,
  FaqQuestion,
  Subcategory,
} from "./types";
import type { MessageProvider } from "./message-provider";

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const err = data as ApiErrorBody;
    throw new Error(err.error ?? "Request failed");
  }
  return data as T;
}

/**
 * Browser-side FAQ data client (calls Next.js API routes).
 * Server components can use Supabase directly via lib/supabase/server.ts.
 */
export class FaqApiClient implements MessageProvider {
  async getCategories(): Promise<Category[]> {
    const res = await fetch("/api/categories");
    const data = await parseJson<{ categories: Category[] }>(res);
    return data.categories;
  }

  async getSubcategories(categoryId: string): Promise<Subcategory[]> {
    const res = await fetch(
      `/api/subcategories?categoryId=${encodeURIComponent(categoryId)}`
    );
    const data = await parseJson<{ subcategories: Subcategory[] }>(res);
    return data.subcategories;
  }

  async getQuestions(subcategoryId: string): Promise<FaqQuestion[]> {
    const res = await fetch(
      `/api/faqs?subcategoryId=${encodeURIComponent(subcategoryId)}`
    );
    const data = await parseJson<{ faqs: FaqQuestion[] }>(res);
    return data.faqs;
  }

  async getAnswer(faqId: string): Promise<FaqAnswer> {
    const res = await fetch(`/api/faqs/${encodeURIComponent(faqId)}`);
    const data = await parseJson<{ faq: FaqAnswer }>(res);
    return data.faq;
  }
}

export const faqApiClient = new FaqApiClient();
