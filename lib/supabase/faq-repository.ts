import type { Category, FaqAnswer, FaqQuestion, Subcategory } from "@/lib/chatbot/types";
import { createServerClient } from "./server";

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchSubcategories(
  categoryId: string
): Promise<Subcategory[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, name")
    .eq("category_id", categoryId)
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchFaqQuestions(
  subcategoryId: string
): Promise<FaqQuestion[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, subcategory_id, question")
    .eq("subcategory_id", subcategoryId)
    .order("question");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchFaqAnswer(faqId: string): Promise<FaqAnswer | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, subcategory_id, question, answer")
    .eq("id", faqId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
