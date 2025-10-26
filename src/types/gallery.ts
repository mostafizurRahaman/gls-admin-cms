// TypeScript types for Gallery entity
export interface ImageMetadata {
  id?: string;
  url: string;
  publicId?: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface Gallery {
  id: string;
  caption?: string;
  isActive: boolean;
  categoryId?: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  image?: ImageMetadata;
  category?: {
    id: string;
    name: string;
    tagline?: string;
  };
}

// Flattened type for export (only primitive types)
export type GalleryExportData = {
  id: string;
  caption: string | null;
  isActive: boolean;
  categoryId: string | null;
  imageId: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  imagePublicId: string;
  categoryName: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    total_pages: number;
    total_items: number;
    limit: number;
  };
}

export interface GalleriesResponse {
  success: boolean;
  message: string;
  data: Gallery[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface GalleryResponse {
  success: boolean;
  message: string;
  data: {
    gallery: Gallery;
  };
}

export interface GalleryBulkExportResponse {
  success: boolean;
  message: string;
  data: Gallery[];
  summary?: {
    total: number;
    exportedAt: string;
  };
}

// Request types
export interface CreateGalleryRequest {
  categoryId?: string;
  image: ImageMetadata;
  caption?: string;
  isActive?: boolean;
}

export interface UpdateGalleryRequest {
  caption?: string;
  categoryId?: string | null;
  isActive?: boolean;
}

export interface GetAllGalleriesRequest {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "caption";
  sortOrder?: "asc" | "desc";
  from_date?: string;
  to_date?: string;
}

export interface GetGalleryDetailsRequest {
  id: string;
}

export interface DeleteGalleryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    caption?: string;
    categoryName?: string;
    deletedImageId?: string;
    cloudinaryDeletion?: {
      type: string;
      result: {
        public_id: string;
        secure_url: string;
      };
    };
  };
}

export interface GetGalleriesForBulkExportRequest {
  ids?: string[];
  categoryId?: string;
  isActive?: boolean;
  limit?: number;
}
