import { z } from "zod";

export const updateGallerySchema = z
  .object({
    caption: z.string().max(255, "Caption too long").optional(),
    categoryId: z.string().uuid("Invalid category ID").nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
    }
  );

export type UpdateGalleryType = z.infer<typeof updateGallerySchema>;
