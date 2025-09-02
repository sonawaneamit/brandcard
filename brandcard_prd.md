# Brandcard PRD and Build Prompt for Cursor

## Project name
`brandcard` (working title)

## Goal
Ship a light, mobile friendly web app that generates on-brand images from simple inputs. Preserve Bannerbear basics, then add five breakout features that are easy for non-technical users.

## Core features for MVP
1) Template Editor Lite, text and image fields, brand colors and fonts, live preview  
2) Template Library, 10 to 15 presets  
3) Rendering Engine, server side image generation to PNG using `@vercel/og`  
4) Storage and sharing, save to Supabase Storage, share and download links  
5) Accounts and billing, Supabase Auth and Stripe subscriptions

## Five breakout features
1) Shareable Template Forms, public link per template, optional password  
2) Smart Fill, one sentence in, auto fills headline, subhead, CTA using an LLM, enforces lengths  
3) URL to Image, paste a link, grab Open Graph tags, prefill template, generate  
4) Slack to Image, slash command returns PNG  
5) Platform Pack, one template outputs all common sizes in one click, text auto fit and basic contrast guard

## Tech stack
- Next.js 14 App Router, TypeScript, React Server Components, Edge routes for image render  
- Tailwind CSS  
- Shadcn UI (button, input, textarea, select, dialog, toast)  
- Supabase Auth, Postgres, Storage  
- Stripe Checkout and customer portal  
- `@vercel/og` for image generation  
- Slack App, slash command using Slack Web API  
- LLM provider (OpenAI compatible SDK) for Smart Fill  
- Hosting on Vercel  
- Optional: Upstash Redis for public form rate limiting

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER_ID=
STRIPE_PRICE_TEAM_ID=
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
LLM_API_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com
UPSTASH_REDIS_REST_URL=   (optional)
UPSTASH_REDIS_REST_TOKEN= (optional)
```

## Folder structure
Create the following structure and files.

```
brandcard/
  app/
    layout.tsx
    globals.css
    page.tsx                         // Landing with live demo links
    dashboard/
      page.tsx                       // Templates list and renders
    templates/
      new/page.tsx                   // Create template wizard
      [id]/
        page.tsx                     // Editor Lite
    t/
      [id]/page.tsx                  // Public Shareable Form page
    api/
      auth/route.ts                  // Supabase auth helpers if needed
      render/route.ts                // POST generate single image
      render/pack/route.ts           // POST generate Platform Pack
      smartfill/route.ts             // POST Smart Fill
      url2image/route.ts             // POST fetch OG and prefill
      slack/command/route.ts         // POST Slack slash command
      webhooks/stripe/route.ts       // Stripe webhook
      webhooks/render/route.ts       // optional, user webhooks
  components/
    ui/                              // Shadcn components
    editor/
      TemplateEditor.tsx
      FieldControls.tsx
      LivePreview.tsx
    forms/
      PublicTemplateForm.tsx
  lib/
    supabaseClient.ts
    stripe.ts
    auth.ts
    og/
      renderLayout.tsx               // React layout for @vercel/og
      packSizes.ts                   // size map and safe zones
      contrast.ts                    // WCAG contrast helper
      textFit.ts                     // clamp and truncate helpers
    slack.ts
    rateLimit.ts
    ogTags.ts                        // URL to Image helpers
    llm.ts                           // Smart Fill helper
    validation.ts                    // zod schemas
  prisma/ or sql/
    schema.sql                       // Supabase DDL
  public/
    fonts/                           // sample fonts
  scripts/
    seed.ts                          // seed presets and demo template
  package.json
  README.md
  .env.local.example
  tailwind.config.ts
  tsconfig.json
  postcss.config.js
```

## Database schema, Supabase SQL
Run this in Supabase SQL editor.

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

create table brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  primary_color text default '#111111',
  secondary_color text default '#ffffff',
  font_primary_url text,
  font_secondary_url text,
  logo_url text,
  created_at timestamptz default now()
);

-- templates.fields and .default_values hold the editable schema
create table templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  width int not null,
  height int not null,
  fields jsonb not null,
  default_values jsonb,
  brand_kit_id uuid references brand_kits(id),
  is_public_form boolean default false,
  form_password_hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table renders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  template_id uuid references templates(id) on delete set null,
  payload jsonb not null,
  url text not null,
  size text default 'original',
  created_at timestamptz default now()
);

create table slack_installations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  team_id text,
  team_name text,
  access_token text,
  bot_user_id text,
  created_at timestamptz default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  stripe_customer_id text,
  stripe_sub_id text,
  plan text,
  status text,
  current_period_end timestamptz
);

-- RLS examples
alter table templates enable row level security;
create policy "own templates"
  on templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table brand_kits enable row level security;
create policy "own brand kits"
  on brand_kits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table renders enable row level security;
create policy "read own renders"
  on renders for select
  using (auth.uid() = user_id);
```

## Template field schema
```ts
// lib/validation.ts
import { z } from "zod";

export const FieldType = z.enum(["text","image"]);
export const TemplateField = z.object({
  key: z.string(),
  label: z.string(),
  type: FieldType,
  maxLen: z.number().optional(),
  required: z.boolean().optional(),
  align: z.enum(["left","center","right"]).optional(),
});
export const FieldsSchema = z.array(TemplateField);

export type TField = z.infer<typeof TemplateField>;
```

Example `fields` JSON saved in `templates`:
```json
[
  { "key":"headline","label":"Headline","type":"text","maxLen":48,"align":"center" },
  { "key":"subhead","label":"Subhead","type":"text","maxLen":80,"align":"center" },
  { "key":"cta","label":"CTA","type":"text","maxLen":18,"align":"center" },
  { "key":"photo","label":"Product Photo","type":"image" }
]
```

## Rendering layout for `@vercel/og`
Place in `lib/og/renderLayout.tsx`.

```tsx
/* @jsxImportSource react */
import { ImageResponse } from "next/og";

type LayoutProps = {
  width: number;
  height: number;
  values: Record<string, string>;
  brand: { primary: string; secondary: string; logoUrl?: string; fontPrimary?: ArrayBuffer };
};

export async function renderOG(props: LayoutProps) {
  const { width, height, values, brand } = props;
  const fontData = brand.fontPrimary;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          background: brand.secondary || "#ffffff",
          color: brand.primary || "#111111",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {values.photo ? (
          <img
            src={values.photo}
            style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%" }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: "auto 40px 40px 40px",
            background: "rgba(0,0,0,0.35)",
            padding: "24px",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, textAlign: "center" }}>
            {values.headline || "Your Headline"}
          </div>
          <div style={{ marginTop: 12, fontSize: 32, textAlign: "center" }}>
            {values.subhead || "Short supporting line goes here"}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              textAlign: "center",
              background: "#ffffff",
              color: "#111111",
              padding: "10px 18px",
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            {values.cta || "Shop now"}
          </div>
        </div>

        {brand.logoUrl ? (
          <img src={brand.logoUrl} style={{ position: "absolute", top: 28, left: 28, width: 140, height: 40 }} />
        ) : null}
      </div>
    ),
    {
      width,
      height,
      fonts: fontData
        ? [{ name: "Inter", data: fontData, weight: 400, style: "normal" }]
        : [],
    }
  );
}
```

## Image render API routes

**Single render**
```ts
// app/api/render/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderOG } from "@/lib/og/renderLayout";
import { getTemplateById, loadBrandKitAssets, uploadToStorage } from "@/lib/supabaseClient";
import { z } from "zod";

const RenderBody = z.object({
  templateId: z.string(),
  fields: z.record(z.string(), z.string().url().or(z.string())).default({}),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.enum(["png"]).default("png")
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const body = RenderBody.parse(json);

  const tpl = await getTemplateById(body.templateId);
  if (!tpl) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const brand = await loadBrandKitAssets(tpl.brand_kit_id);
  const width = body.width ?? tpl.width;
  const height = body.height ?? tpl.height;

  const img = await renderOG({ width, height, values: body.fields, brand });

  const arrayBuffer = await img.arrayBuffer();
  const url = await uploadToStorage(arrayBuffer, \`renders/\${crypto.randomUUID()}.png\`, "image/png");

  return NextResponse.json({ url });
}
```

**Platform Pack**
```ts
// app/api/render/pack/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PACK_SIZES } from "@/lib/og/packSizes";
import { renderOG } from "@/lib/og/renderLayout";
import { uploadToStorage } from "@/lib/supabaseClient";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { templateId, fields } = await req.json();
  // TODO: load template and brand like single render
  const items: Array<{ size: string; url: string }> = [];

  for (const s of PACK_SIZES) {
    const img = await renderOG({ width: s.w, height: s.h, values: fields, brand: { primary:"#111111", secondary:"#ffffff" } });
    const buf = await img.arrayBuffer();
    const url = await uploadToStorage(buf, \`renders/\${crypto.randomUUID()}_\${s.name}.png\`, "image/png");
    items.push({ size: s.name, url });
  }

  return NextResponse.json({ items });
}
```

**packSizes**
```ts
// lib/og/packSizes.ts
export const PACK_SIZES = [
  { name: "instagram-square", w: 1080, h: 1080 },
  { name: "instagram-portrait", w: 1080, h: 1350 },
  { name: "story-9x16", w: 1080, h: 1920 },
  { name: "og-1200x630", w: 1200, h: 630 },
  { name: "youtube-1280x720", w: 1280, h: 720 },
  { name: "linkedin-1200x1200", w: 1200, h: 1200 }
];
```

**Contrast helper**
```ts
// lib/og/contrast.ts
export function luminance(hex: string) {
  const c = hex.replace("#",""); const r = parseInt(c.slice(0,2),16)/255; const g = parseInt(c.slice(2,4),16)/255; const b = parseInt(c.slice(4,6),16)/255;
  const a = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
  return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
}
export function contrastRatio(fg: string, bg: string) {
  const L1 = luminance(fg) + 0.05; const L2 = luminance(bg) + 0.05;
  return L1 > L2 ? L1/L2 : L2/L1;
}
```

**Text fit helper**
```ts
// lib/og/textFit.ts
export function clampFont(base: number, min: number, max: number, len: number, maxLen: number) {
  if (!maxLen) return Math.min(max, Math.max(min, base));
  const ratio = Math.max(0.6, 1 - (len - Math.min(len, maxLen)) / Math.max(1, maxLen * 2));
  const size = base * ratio;
  return Math.min(max, Math.max(min, Math.floor(size)));
}

export function ellipsize(s: string, maxLen?: number) {
  if (!maxLen) return s;
  return s.length <= maxLen ? s : s.slice(0, Math.max(0, maxLen - 1)) + "…";
}
```

## Shareable Template Forms

**Public page**
```tsx
// app/t/[id]/page.tsx
import PublicTemplateForm from "@/components/forms/PublicTemplateForm";

export default function PublicFormPage({ params }: { params: { id: string } }) {
  return <PublicTemplateForm templateId={params.id} />;
}
```

**Form component**
```tsx
// components/forms/PublicTemplateForm.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function PublicTemplateForm({ templateId }: { templateId: string }) {
  const [tpl, setTpl] = useState<any>(null);
  const [values, setValues] = useState<Record<string,string>>({});
  const [imgUrl, setImgUrl] = useState<string>("");

  useEffect(() => { fetch(\`/api/templates/\${templateId}\`).then(r=>r.json()).then(setTpl); }, [templateId]);

  if (!tpl) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">{tpl.name}</h1>
      <div className="space-y-3">
        {tpl.fields.map((f:any) => (
          <div key={f.key}>
            <label className="block text-sm mb-1">{f.label}</label>
            <input
              className="w-full border rounded px-3 py-2"
              type={f.type === "image" ? "url" : "text"}
              placeholder={f.type === "image" ? "https://image.jpg" : ""}
              onChange={(e)=> setValues(v => ({...v, [f.key]: e.target.value}))}
            />
          </div>
        ))}
        <button
          onClick={async () => {
            const res = await fetch("/api/render", { method: "POST", body: JSON.stringify({ templateId, fields: values }) });
            const data = await res.json(); setImgUrl(data.url);
          }}
          className="w-full bg-black text-white py-2 rounded"
        >
          Generate
        </button>
      </div>

      {imgUrl ? (
        <div className="mt-4">
          <Image src={imgUrl} alt="Result" width={tpl.width} height={tpl.height} className="w-full h-auto rounded border" />
          <div className="flex gap-2 mt-2">
            <a className="px-3 py-2 border rounded" href={imgUrl} download>Download PNG</a>
            <button className="px-3 py-2 border rounded" onClick={() => navigator.clipboard.writeText(imgUrl)}>Copy link</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
```

## Smart Fill

**LLM helper**
```ts
// lib/llm.ts
export async function smartFill(templateFields: Array<{key:string;maxLen?:number}>, prompt: string) {
  const schema = { headline: "", subhead: "", cta: "" };
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{ "Authorization":`Bearer ${process.env.LLM_API_KEY}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role:"system", content:"Return only JSON with keys headline, subhead, cta. Respect max lengths if given: headline <= 48, subhead <= 80, cta <= 18. Keep promotional, clear, brand neutral." },
        { role:"user", content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });
  const data = await resp.json();
  const out = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  return { ...schema, ...out };
}
```

**Route**
```ts
// app/api/smartfill/route.ts
import { NextRequest, NextResponse } from "next/server";
import { smartFill } from "@/lib/llm";
export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { templateId, prompt } = await req.json();
  // TODO: load template fields from DB by templateId
  const fields = [{ key: "headline", maxLen: 48 }, { key: "subhead", maxLen: 80 }, { key: "cta", maxLen: 18 }];
  const result = await smartFill(fields, prompt);
  return NextResponse.json({ fields: result });
}
```

## URL to Image

**OG helper**
```ts
// lib/ogTags.ts
export async function fetchOG(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  const get = (name: string) => {
    const rx = new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
    return rx.exec(html)?.[1] || "";
  };
  return {
    title: get("og:title") || /<title>(.*?)<\/title>/i.exec(html)?.[1] || "",
    description: get("og:description") || "",
    image: get("og:image") || "",
    url
  };
}
```

**Route**
```ts
// app/api/url2image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchOG } from "@/lib/ogTags";
export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { url, templateId } = await req.json();
  try {
    const og = await fetchOG(url);
    return NextResponse.json({ prefillFields: { headline: og.title, subhead: og.description, photo: og.image } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch OG tags" }, { status: 400 });
  }
}
```

## Slack to Image

**Route**
```ts
// app/api/slack/command/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
export const runtime = "nodejs";

function verifySlack(req: NextRequest, bodyText: string) {
  const ts = req.headers.get("x-slack-request-timestamp") || "";
  const sig = req.headers.get("x-slack-signature") || "";
  const base = \`v0:\${ts}:\${bodyText}";
  const mySig = "v0=" + crypto.createHmac("sha256", process.env.SLACK_SIGNING_SECRET!).update(base).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(mySig));
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  if (!verifySlack(req, bodyText)) return new NextResponse("Invalid signature", { status: 401 });

  const params = new URLSearchParams(bodyText);
  const text = params.get("text") || "Quick promo";

  const res = await fetch(\`\${process.env.NEXT_PUBLIC_APP_URL}/api/render\`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ templateId: "DEFAULT_TEMPLATE_UUID", fields: { headline: text, cta: "Shop now" } })
  });
  const data = await res.json();

  return NextResponse.json({
    response_type: "in_channel",
    text: "Here is your image",
    attachments: [{ image_url: data.url, alt_text: "Generated" }]
  });
}
```

## Stripe integration

**Server helpers**
```ts
// lib/stripe.ts
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
```

**Checkout**
```ts
// app/api/billing/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
export async function POST(req: NextRequest) {
  const { priceId, customerEmail } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=1\`,
  });
  return NextResponse.json({ url: session.url });
}
```

**Webhook**
```ts
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const buf = Buffer.from(await req.arrayBuffer());
  let event;
  try { event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch { return new NextResponse("Bad signature", { status: 400 }); }

  // TODO: handle customer.subscription.created or updated and upsert subscriptions table
  return NextResponse.json({ received: true });
}
```

## Supabase client
```ts
// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function uploadToStorage(buf: ArrayBuffer, path: string, contentType: string) {
  const { data, error } = await supabase.storage.from("renders").upload(path, new Uint8Array(buf), { contentType, upsert: true });
  if (error) throw error;
  const { data: pub } = supabase.storage.from("renders").getPublicUrl(path);
  return pub.publicUrl;
}
```

## UX flows and acceptance checks

**First-time user**
1) Landing, click Try a live form, generate from a preset form without login.  
2) Click Save this template, sign up modal, magic link, land in dashboard.  
3) Open same template, hit Smart Fill, Generate, download or copy link.  
4) Click Platform Pack, download zip or multiple URLs.

**Shareable Form sender**
1) In dashboard, open template, click Share form, set optional password.  
2) Copy link, send to VA or client, they generate on mobile.

**Slack**
1) Install Slack app, map default template alias.  
2) In channel, `/card "Weekend sale, 20 percent off"`.  
3) Bot returns PNG and link.

**Acceptance checks**
- Public Shareable Form works on mobile and desktop, generates PNG, shows link and download.  
- Smart Fill endpoint returns JSON fields within limits for a prompt.  
- URL to Image fills fields from a valid blog URL.  
- Platform Pack returns a list of URLs for six sizes.  
- Slack slash command echoes a PNG back when called.  
- Stripe checkout opens and returns to dashboard.

## Commands for Cursor to run
1) Scaffold Next.js App Router with TypeScript and Tailwind.  
2) Install packages:
```
npm i @vercel/og zod stripe @supabase/supabase-js
npm i -D tailwindcss postcss autoprefixer
```
3) Init Shadcn and add Button, Input, Textarea, Select, Dialog, Toast.  
4) Create Supabase storage buckets: renders, fonts, logos.  
5) Create the SQL tables and RLS policies.  
6) Add routes and components.  
7) Seed one demo template with is_public_form = true, width 1200 height 630, and set DEFAULT_TEMPLATE_UUID in Slack route.  
8) Deploy to Vercel, set environment variables, test public form, Smart Fill, Platform Pack.
