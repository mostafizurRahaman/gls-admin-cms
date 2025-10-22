// src/schema/sliders/update-slider.schema.ts

import { z } from "zod";

export const updateSliderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),

  subtitle: z
    .string()
    .max(500, "Subtitle must not exceed 500 characters")
    .optional()
    .or(z.literal("")),

  imageUrl: z.string().url("Please enter a valid URL").optional(),

  buttonText: z
    .string()
    .max(50, "Button text must not exceed 50 characters")
    .optional()
    .or(z.literal("")),

  buttonUrl: z.string().optional().or(z.literal("")),

  isActive: z.boolean().optional(),
});

export type UpdateSliderFormData = z.infer<typeof updateSliderSchema>;
