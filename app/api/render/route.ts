import { NextRequest, NextResponse } from "next/server";
import { renderOG } from "@/lib/og/renderLayout";
import { getTemplateById, loadBrandKitAssets, uploadToStorage, createRender } from "@/lib/supabaseClient";
import { RenderRequestSchema } from "@/lib/validation";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = RenderRequestSchema.parse(json);

    const tpl = await getTemplateById(body.templateId);
    if (!tpl) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const brand = await loadBrandKitAssets(tpl.brand_kit_id);
    const width = body.width ?? tpl.width;
    const height = body.height ?? tpl.height;

    const img = await renderOG({ 
      width, 
      height, 
      values: body.fields, 
      brand 
    });

    const arrayBuffer = await img.arrayBuffer();
    const url = await uploadToStorage(
      arrayBuffer, 
      `renders/${crypto.randomUUID()}.png`, 
      "image/png"
    );

    // Save render record
    await createRender(
      null, // user_id - will be null for public forms
      body.templateId,
      body.fields,
      url,
      "original"
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: "Failed to render image" }, 
      { status: 500 }
    );
  }
}
