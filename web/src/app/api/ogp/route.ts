import { NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  try {
    const { result } = await ogs({ url });
    return NextResponse.json({
      title: result.ogTitle || "",
      description: result.ogDescription || "",
      image: result.ogImage?.[0]?.url || "",
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
