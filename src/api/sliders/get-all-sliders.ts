// src/api/sliders/get-all-sliders.ts

import axiosInstance, { ApiResponse } from "@/configs/axios";
import { GetAllSlidersParams, GetAllSlidersResponse } from "@/types/sliders";

/**
 * Fetch all sliders with optional filters
 * @param params - Filter parameters
 * @param params.active_only - Filter by active status (default: true)
 * @param params.sort - Sort order by orderNumber (default: "asc")
 * @param params.limit - Maximum number of sliders to return
 * @param params.offset - Number of sliders to skip (default: 0)
 * @returns Promise with sliders data and pagination info
 */
export const getAllSliders = async (
  params?: GetAllSlidersParams
): Promise<ApiResponse<GetAllSlidersResponse>> => {
  // Build query parameters
  const queryParams: Record<string, string | number> = {};

  // Handle active_only parameter
  if (params?.active_only !== undefined) {
    queryParams.active_only =
      typeof params.active_only === "boolean"
        ? String(params.active_only)
        : params.active_only;
  } else {
    queryParams.active_only = "true"; // Default value
  }

  // Handle sort parameter
  if (params?.sort) {
    queryParams.sort = params.sort;
  }

  // Handle limit parameter
  if (params?.limit !== undefined) {
    queryParams.limit = params.limit;
  }

  // Handle offset parameter
  if (params?.offset !== undefined) {
    queryParams.offset = params.offset;
  } else {
    queryParams.offset = 0; // Default value
  }

  const response = await axiosInstance.get<ApiResponse<GetAllSlidersResponse>>(
    "/hr-slider/get-all",
    { params: queryParams }
  );

  return response.data;
};
