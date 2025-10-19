// src/api/categories/utils/config.ts
import { useMemo } from "react";
import { CategoryDisplay, CategoryExportable } from "@/types";
import { formatDateOnly } from "@/lib/format-date";

/**
 * Transform category data for export by flattening complex fields
 */
const transformCategoryForExport = (
  category: CategoryDisplay
): CategoryExportable => {
  return {
    id: category.id || "N/A",
    name: category.name || "N/A",
    tagline: category.tagline || "N/A",
    description: category.description || "N/A",
    isPremium: category.isPremium ? "Yes" : "No",
    isRepairingService: category.isRepairingService ? "Yes" : "No",
    isShowHome: category.isShowHome ? "Yes" : "No",
    sortOrder: category.sortOrder || 0,
    addons: category.addons?.join(", ") || "N/A",
    createdAt: formatDateOnly(category.createdAt, "UTC"),
  };
};

/**
 * Default export configuration for the categories data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      name: "Name",
      tagline: "Tagline",
      description: "Description",
      isPremium: "Premium",
      isRepairingService: "Repairing Service",
      isShowHome: "Show on Home",
      sortOrder: "Sort Order",
      addons: "Addons",
      createdAt: "Created At",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 15 }, // ID
      { wch: 25 }, // Name
      { wch: 40 }, // Tagline
      { wch: 60 }, // Description
      { wch: 12 }, // Premium
      { wch: 18 }, // Repairing Service
      { wch: 15 }, // Show on Home
      { wch: 12 }, // Sort Order
      { wch: 50 }, // Addons
      { wch: 15 }, // Created At
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "name",
      "tagline",
      "description",
      "isPremium",
      "isRepairingService",
      "isShowHome",
      "sortOrder",
      "addons",
      "createdAt",
    ];
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "categories",
    transformFunction: transformCategoryForExport,
  };
}
