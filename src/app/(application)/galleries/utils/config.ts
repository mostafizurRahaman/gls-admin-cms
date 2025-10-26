import { formatDateOnly } from "@/lib/format-date";
import { GalleryExportData } from "@/types";
import { useMemo } from "react";

export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      caption: "Caption",
      isActive: "Status",
      categoryId: "Category ID",
      imageId: "Image ID",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
      imageUrl: "Image URL",
      imagePublicId: "Image Public ID",
      categoryName: "Category Name",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 40 }, // Caption
      { wch: 12 }, // Status
      { wch: 20 }, // Category ID
      { wch: 20 }, // Image ID
      { wch: 20 }, // Created Date
      { wch: 20 }, // Updated Date
      { wch: 50 }, // Image URL
      { wch: 30 }, // Image Public ID
      { wch: 25 }, // Category Name
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "caption",
      "isActive",
      "categoryId",
      "imageId",
      "createdAt",
      "updatedAt",
      "imageUrl",
      "imagePublicId",
      "categoryName",
    ];
  }, []);

  // Transform function for export data formatting
  const transformData = useMemo(() => {
    return (data: GalleryExportData) => {
      return {
        id: data.id,
        caption: (data.caption as string) || "",
        isActive: data.isActive ? "Active" : "Inactive",
        categoryId: data.categoryId || "",
        imageId: data.imageId,
        createdAt: data.createdAt
          ? formatDateOnly(new Date(data.createdAt))
          : "",
        imageUrl: (data.image?.url as string) || "",
        imagePublicId: (data.image?.publicId as string) || "",
        categoryName: (data.category?.name as unknown as string) || "",
      };
    };
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "galleries", // Used for filename
    transformFunction: transformData,
  };
}
