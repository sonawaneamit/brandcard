import { z } from "zod";

export const FieldType = z.enum(["text", "image"]);
export const TemplateField = z.object({
  key: z.string(),
  label: z.string(),
  type: FieldType,
  maxLen: z.number().optional(),
  required: z.boolean().optional(),
  align: z.enum(["left", "center", "right"]).optional(),
});
export const FieldsSchema = z.array(TemplateField);

export type TField = z.infer<typeof TemplateField>;

// Template validation
export const TemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  width: z.number().min(100).max(4000),
  height: z.number().min(100).max(4000),
  fields: FieldsSchema,
  default_values: z.record(z.string()).optional(),
});

export type Template = z.infer<typeof TemplateSchema>;

// Brand kit validation
export const BrandKitSchema = z.object({
  name: z.string().min(1, "Brand kit name is required"),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid primary color"),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid secondary color"),
  font_primary_url: z.string().url().optional(),
  font_secondary_url: z.string().url().optional(),
  logo_url: z.string().url().optional(),
});

export type BrandKit = z.infer<typeof BrandKitSchema>;

// Render request validation
export const RenderRequestSchema = z.object({
  templateId: z.string().uuid(),
  fields: z.record(z.string(), z.string()),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.enum(["png"]).default("png"),
});

export type RenderRequest = z.infer<typeof RenderRequestSchema>;
