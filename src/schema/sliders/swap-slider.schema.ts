// src/schema/sliders/swap-slider.schema.ts

import { z } from "zod";

export const swapSliderSchema = z.object({
  targetSliderId: z
    .number({
      error: "Target slider ID is required",
    })
    .int("Target slider ID must be an integer")
    .positive("Target slider ID must be positive"),
});

export type SwapSliderFormData = z.infer<typeof swapSliderSchema>;
