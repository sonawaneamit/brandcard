import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function verifySlack(req: NextRequest, bodyText: string) {
  const ts = req.headers.get("x-slack-request-timestamp") || "";
  const sig = req.headers.get("x-slack-signature") || "";
  const base = `v0:${ts}:${bodyText}`;
  const mySig = "v0=" + crypto
    .createHmac("sha256", process.env.SLACK_SIGNING_SECRET!)
    .update(base)
    .digest("hex");
  
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(mySig));
}

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    
    if (!verifySlack(req, bodyText)) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const params = new URLSearchParams(bodyText);
    const text = params.get("text") || "Quick promo";

    // Use a default template ID - this should be set in environment variables
    const defaultTemplateId = process.env.DEFAULT_TEMPLATE_UUID;
    
    if (!defaultTemplateId) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "No default template configured. Please contact your administrator."
      });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        templateId: defaultTemplateId, 
        fields: { 
          headline: text, 
          cta: "Shop now" 
        } 
      })
    });
    
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Failed to generate image. Please try again."
      });
    }

    return NextResponse.json({
      response_type: "in_channel",
      text: "Here is your image",
      attachments: [{ 
        image_url: data.url, 
        alt_text: "Generated image" 
      }]
    });
  } catch (error) {
    console.error("Slack command error:", error);
    return NextResponse.json({
      response_type: "ephemeral",
      text: "An error occurred. Please try again."
    });
  }
}
