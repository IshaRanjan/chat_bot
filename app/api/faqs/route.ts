import { NextRequest, NextResponse } from "next/server";
import { fetchFaqQuestions } from "@/lib/supabase/faq-repository";

/** Returns FAQ questions (without answers) for a subcategory. */
export async function GET(request: NextRequest) {
  const subcategoryId = request.nextUrl.searchParams.get("subcategoryId");

  if (!subcategoryId) {
    return NextResponse.json(
      { error: "subcategoryId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const faqs = await fetchFaqQuestions(subcategoryId);
    return NextResponse.json({ faqs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch FAQs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
