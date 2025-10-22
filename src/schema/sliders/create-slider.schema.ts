// src/schema/sliders/create-slider.schema.ts

import { z } from "zod";

export const createSliderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),

  subtitle: z
    .string()
    .max(500, "Subtitle must not exceed 500 characters")
    .optional()
    .transform((val) => val || undefined),

  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("Please enter a valid URL"),

  buttonText: z
    .string()
    .max(50, "Button text must not exceed 50 characters")
    .optional()
    .transform((val) => val || undefined),

  buttonUrl: z
    .string()
    .optional()
    .transform((val) => val || undefined),

  orderNumber: z
    .number()
    .int("Order number must be an integer")
    .positive("Order number must be positive")
    .optional()
    .nullable()
    .transform((val) => val || undefined),

  isActive: z.boolean().optional().default(true),
});

export type CreateSliderFormData = z.infer<typeof createSliderSchema>;
