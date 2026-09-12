import { searchMulti } from "@/data/tmdb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return NextResponse.json(
      {
        status: 400,
        error: "Missing query",
        message: "Query param `q` is required",
        data: [],
      },
      { status: 400 }
    );
  }
  const results = await searchMulti(query);
  return NextResponse.json({
    status: 200,
    error: null,
    message: "search results",
    data: results,
  });
}