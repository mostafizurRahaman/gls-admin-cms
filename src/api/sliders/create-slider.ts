import axiosInstance from "@/configs/axios";
import { CreateSliderApiData, Slider } from "@/schema/sliders";

export interface CreateSliderResponse {
  success: boolean;
  message: string;
  data?: {
    newSlider: Slider;
    allSliders: Slider[];
    totalCount: number;
  };
}

export const createSlider = async (data: CreateSliderApiData) => {
  const response = await axiosInstance.post<CreateSliderResponse>(
    "/sliders/create/",
    data
  );
  return response.data;
};
