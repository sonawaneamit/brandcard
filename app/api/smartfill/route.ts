import { NextRequest, NextResponse } from "next/server";
import { smartFill } from "@/lib/llm";
import { getTemplateById } from "@/lib/supabaseClient";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { templateId, prompt } = await req.json();
    
    if (!templateId || !prompt) {
      return NextResponse.json(
        { error: "Template ID and prompt are required" }, 
        { status: 400 }
      );
    }

    const template = await getTemplateById(templateId);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const fields = template.fields || [];
    const result = await smartFill(fields, prompt);
    
    return NextResponse.json({ fields: result });
  } catch (error) {
    console.error("Smart fill error:", error);
    return NextResponse.json(
      { error: "Failed to generate smart fill" }, 
      { status: 500 }
    );
  }
}
