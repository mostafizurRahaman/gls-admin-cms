// src/api/sliders/get-slider-by-id.ts

import axiosInstance, { ApiResponse } from "@/configs/axios";
import { Slider } from "@/types/sliders";

export const getSliderById = async (
  id: number | string
): Promise<ApiResponse<Slider>> => {
  const response = await axiosInstance.get<ApiResponse<Slider>>(
    `/hr-slider/get-by-id/${id}`
  );
  return response.data;
};
