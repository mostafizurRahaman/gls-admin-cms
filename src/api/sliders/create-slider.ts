// src/api/sliders/create-slider.ts

import axiosInstance, { ApiResponse } from "@/configs/axios";
import { CreateSliderRequest, Slider } from "@/types/sliders";

export const createSlider = async (
  data: CreateSliderRequest
): Promise<ApiResponse<Slider>> => {
  const response = await axiosInstance.post<ApiResponse<Slider>>(
    "/hr-slider/create",
    data
  );
  return response.data;
};
