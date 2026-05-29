import { NextRequest, NextResponse } from "next/server";
import { fetchSubcategories } from "@/lib/supabase/faq-repository";

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const subcategories = await fetchSubcategories(categoryId);
    return NextResponse.json({ subcategories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch subcategories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
