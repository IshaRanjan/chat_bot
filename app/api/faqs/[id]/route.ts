import { NextRequest, NextResponse } from "next/server";
import { fetchFaqAnswer } from "@/lib/supabase/faq-repository";

/** Returns a single FAQ with its answer. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "FAQ id is required" }, { status: 400 });
  }

  try {
    const faq = await fetchFaqAnswer(id);
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json({ faq });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch answer";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
