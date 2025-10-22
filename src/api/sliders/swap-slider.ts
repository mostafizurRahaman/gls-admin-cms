// src/api/sliders/swap-sliders.ts

import axiosInstance, { ApiResponse } from "@/configs/axios";
import { SwapSlidersRequest, SwapSlidersResponse } from "@/types/sliders";

export const swapSliders = async (
  data: SwapSlidersRequest
): Promise<ApiResponse<SwapSlidersResponse>> => {
  const response = await axiosInstance.put<ApiResponse<SwapSlidersResponse>>(
    "/hr-slider/swap",
    data
  );
  return response.data;
};
