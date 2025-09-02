import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadToStorage(
  buf: ArrayBuffer,
  path: string,
  contentType: string
) {
  const { error } = await supabaseAdmin.storage
    .from("renders")
    .upload(path, new Uint8Array(buf), { contentType, upsert: true });
  
  if (error) throw error;
  
  const { data: pub } = supabaseAdmin.storage
    .from("renders")
    .getPublicUrl(path);
  
  return pub.publicUrl;
}

export async function getTemplateById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function loadBrandKitAssets(brandKitId: string | null) {
  if (!brandKitId) {
    return {
      primary: "#111111",
      secondary: "#ffffff",
      logoUrl: undefined,
      fontPrimary: undefined,
    };
  }

  const { data, error } = await supabaseAdmin
    .from("brand_kits")
    .select("*")
    .eq("id", brandKitId)
    .single();

  if (error) {
    console.warn("Failed to load brand kit:", error);
    return {
      primary: "#111111",
      secondary: "#ffffff",
      logoUrl: undefined,
      fontPrimary: undefined,
    };
  }

  let fontData: ArrayBuffer | undefined;
  if (data.font_primary_url) {
    try {
      const fontResponse = await fetch(data.font_primary_url);
      fontData = await fontResponse.arrayBuffer();
    } catch (error) {
      console.warn("Failed to load font:", error);
    }
  }

  return {
    primary: data.primary_color,
    secondary: data.secondary_color,
    logoUrl: data.logo_url,
    fontPrimary: fontData,
  };
}

export async function createRender(
  userId: string | null,
  templateId: string,
  payload: Record<string, string>,
  url: string,
  size: string = "original"
) {
  const { data, error } = await supabaseAdmin
    .from("renders")
    .insert({
      user_id: userId,
      template_id: templateId,
      payload,
      url,
      size,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
