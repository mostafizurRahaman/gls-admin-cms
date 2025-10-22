// src/types/slider.ts

export interface Slider {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  orderNumber: number;
  buttonUrl: string | null;
  buttonText: string | null;
  isActive: boolean;
  userId: string | null;
  modifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  modifiedByUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreateSliderRequest {
  title: string;
  subtitle?: string;
  imageUrl: string;
  orderNumber?: number;
  buttonUrl?: string;
  buttonText?: string;
  isActive?: boolean;
}

export interface UpdateSliderRequest {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  buttonUrl?: string;
  buttonText?: string;
  isActive?: boolean;
}

export interface SwapSlidersRequest {
  sliderId1: number;
  sliderId2: number;
}

export interface GetAllSlidersParams {
  active_only?: string;
  sort?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface SliderPagination {
  total: number;
  limit?: number;
  offset: number;
  hasMore: boolean;
}

export interface GetAllSlidersResponse {
  sliders: Slider[];
  pagination: SliderPagination;
}

export interface DeleteSliderResponse {
  deletedSliderId: number;
  totalRemaining: number;
  normalized: boolean;
}

export interface SwapSlidersResponse {
  slider1: number;
  slider2: number;
  swapped: boolean;
}

export interface SliderFormData {
  title: string;
  subtitle: string;
  imageUrl: string;
  orderNumber: number;
  buttonUrl: string;
  buttonText: string;
  isActive: boolean;
}

// Display and export types
export type SliderDisplay = Slider;

export interface SliderExportable {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl: string;
  orderNumber: number;
  buttonText: string;
  buttonUrl: string;
  isActive: string;
  createdAt: string;
}
