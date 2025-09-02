import { NextRequest, NextResponse } from "next/server";
import { PACK_SIZES } from "@/lib/og/packSizes";
import { renderOG } from "@/lib/og/renderLayout";
import { getTemplateById, loadBrandKitAssets, uploadToStorage } from "@/lib/supabaseClient";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { templateId, fields } = await req.json();
    
    const tpl = await getTemplateById(templateId);
    if (!tpl) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const brand = await loadBrandKitAssets(tpl.brand_kit_id);
    const items: Array<{ size: string; url: string }> = [];

    for (const s of PACK_SIZES) {
      const img = await renderOG({ 
        width: s.w, 
        height: s.h, 
        values: fields, 
        brand 
      });
      const buf = await img.arrayBuffer();
      const url = await uploadToStorage(
        buf, 
        `renders/${crypto.randomUUID()}_${s.name}.png`, 
        "image/png"
      );
      items.push({ size: s.name, url });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Pack render error:", error);
    return NextResponse.json(
      { error: "Failed to render pack" }, 
      { status: 500 }
    );
  }
}
