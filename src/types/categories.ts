// src/types/category.ts
export interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cardBannerUrl: string;
  detailsBannerUrl: string;
  isPremium: boolean;
  isRepairingService: boolean;
  isShowHome: boolean;
  sortOrder: number;
  userId: string;
  addons: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDisplay extends Category {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | number | any;
  // Additional display fields if needed
}

export interface CategoryExportable {
  id: string;
  name: string;
  tagline: string;
  description: string;
  isPremium: string;
  isRepairingService: string;
  isShowHome: string;
  sortOrder: number;
  addons: string;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  tagline: string;
  description: string;
  cardBannerUrl: string;
  detailsBannerUrl: string;
  isPremium: boolean;
  isRepairingService: boolean;
  isShowHome: boolean;
  sortOrder: number;
  addons: string[];
}
