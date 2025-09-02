import { NextRequest, NextResponse } from "next/server";
import { fetchOG } from "@/lib/ogTags";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" }, 
        { status: 400 }
      );
    }

    const og = await fetchOG(url);
    
    return NextResponse.json({ 
      prefillFields: { 
        headline: og.title, 
        subhead: og.description, 
        photo: og.image 
      } 
    });
  } catch (error) {
    console.error("URL to image error:", error);
    return NextResponse.json(
      { error: "Failed to fetch OG tags" }, 
      { status: 400 }
    );
  }
}
