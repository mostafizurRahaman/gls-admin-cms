// src/api/sliders/update-slider.ts

import axiosInstance, { ApiResponse } from "@/configs/axios";
import { UpdateSliderRequest, Slider } from "@/types/sliders";

export const updateSlider = async (
  id: number | string,
  data: UpdateSliderRequest
): Promise<ApiResponse<Slider>> => {
  const response = await axiosInstance.put<ApiResponse<Slider>>(
    `/hr-slider/edit/${id}`,
    data
  );
  return response.data;
};
