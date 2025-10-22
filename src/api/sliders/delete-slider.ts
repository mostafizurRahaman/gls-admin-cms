// src/api/sliders/delete-slider.ts

import axiosInstance, { ApiResponse } from "@/configs/axios";
import { DeleteSliderResponse } from "@/types/sliders";

export const deleteSlider = async (
  id: number | string
): Promise<ApiResponse<DeleteSliderResponse>> => {
  const response = await axiosInstance.delete<
    ApiResponse<DeleteSliderResponse>
  >(`/hr-slider/delete/${id}`);
  return response.data;
};
