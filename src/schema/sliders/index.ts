import { z } from "zod";

// ✅ Image metadata schema for CREATE (required fields as defaults)
export const imageMetadataCreateSchema = z.object({
  id: z.string().uuid("Invalid image ID format").optional(),
  url: z.string().url("Invalid image URL"),
  publicId: z.string().default(""),
  folder: z.string().default("app/hero-sliders"),
  altText: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  size: z.number().int().positive().optional(),
});

// ✅ Image metadata schema for UPDATE (all optional)
export const imageMetadataUpdateSchema = z.object({
  id: z.string().uuid("Invalid image ID format").optional(),
  url: z.string().url("Invalid image URL"),
  publicId: z.string().optional(),
  folder: z.string().optional(),
  altText: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  size: z.number().int().positive().optional(),
});

// Response image schema
export const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  publicId: z.string(),
  folder: z.string().nullable(),
  altText: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  format: z.string().nullable(),
  size: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// User schema for createdByUser and modifiedByUser
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const sliderSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable(),
  buttonText: z.string().nullable(),
  buttonUrl: z.string().nullable(),
  isActive: z.boolean(),
  orderNumber: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().nullable(),
  modifiedBy: z.string().nullable(),
  imageId: z.string().nullable(),
  image: imageSchema.nullable(),
  createdByUser: userSchema.nullable(),
  modifiedByUser: userSchema.nullable(),
});

export const slidersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(sliderSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});

// Form schema for frontend (image optional for form validation)
export const createSliderFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long (max 255 chars)"),
  subtitle: z.string().max(255, "Subtitle too long (max 255 chars)").optional(),
  buttonText: z
    .string()
    .max(100, "Button text too long (max 100 chars)")
    .optional(),
  buttonUrl: z
    .string()
    .url("Invalid button URL")
    .max(255, "Button URL too long (max 255 chars)")
    .optional(),
  image: imageMetadataCreateSchema.optional(),
  isActive: z.boolean().default(true),
  orderNumber: z
    .number()
    .int("Order number must be integer")
    .min(1, "Order number must be positive")
    .optional(),
});

// API schema for backend (image required)
export const createSliderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long (max 255 chars)"),
  subtitle: z.string().max(255, "Subtitle too long (max 255 chars)").optional(),
  buttonText: z
    .string()
    .max(100, "Button text too long (max 100 chars)")
    .optional(),
  buttonUrl: z
    .string()
    .url("Invalid button URL")
    .max(255, "Button URL too long (max 255 chars)")
    .optional(),
  image: imageMetadataCreateSchema,
  isActive: z.boolean().default(true),
  orderNumber: z
    .number()
    .int("Order number must be integer")
    .min(1, "Order number must be positive")
    .optional(),
});

// ✅ Update schema with optional image fields
export const updateSliderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long (max 255 chars)")
    .optional(),
  subtitle: z.string().max(255, "Subtitle too long (max 255 chars)").optional(),
  buttonText: z
    .string()
    .max(100, "Button text too long (max 100 chars)")
    .optional(),
  buttonUrl: z
    .string()
    .url("Invalid button URL")
    .max(255, "Button URL too long (max 255 chars)")
    .optional(),
  image: imageMetadataUpdateSchema.optional(),
  isActive: z.boolean().optional(),
  orderNumber: z
    .number()
    .int("Order number must be integer")
    .min(1, "Order number must be positive")
    .optional(),
});

export type Slider = z.infer<typeof sliderSchema>;
export type SlidersResponse = z.infer<typeof slidersResponseSchema>;
export type CreateSliderFormData = z.infer<typeof createSliderFormSchema>;
export type CreateSliderApiData = z.infer<typeof createSliderSchema>;
export type UpdateSliderFormData = z.infer<typeof updateSliderSchema>;
export type ImageMetadata = z.infer<typeof imageMetadataCreateSchema>;

// ✅ Export get sliders parameters interface
export interface GetSlidersParams {
  search?: string;
  from_date?: string;
  to_date?: string;
  sort_by?: "created_at" | "updated_at" | "orderNumber" | "title" | "isActive";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
  active_only?: string;
}

export interface GetSlidersResponse {
  success: boolean;
  message: string;
  data: Slider[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_items: number;
  };
}
