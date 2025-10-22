// src/app/(application)/sliders/utils/config.ts

import { useMemo } from "react";
import { SliderDisplay, SliderExportable } from "@/types/sliders";
import { formatDateOnly } from "@/lib/format-date";

/**
 * Transform slider data for export by flattening complex fields
 */
const transformSliderForExport = (slider: SliderDisplay): SliderExportable => {
  return {
    id: slider.id || "N/A",
    title: slider.title || "N/A",
    subtitle: slider.subtitle || "N/A",
    imageUrl: slider.imageUrl || "N/A",
    orderNumber: slider.orderNumber || 0,
    buttonText: slider.buttonText || "N/A",
    buttonUrl: slider.buttonUrl || "N/A",
    isActive: slider.isActive ? "Yes" : "No",
    createdAt: formatDateOnly(slider.createdAt, "UTC"),
  };
};

/**
 * Default export configuration for the sliders data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      title: "Title",
      subtitle: "Subtitle",
      imageUrl: "Image URL",
      orderNumber: "Order",
      buttonText: "Button Text",
      buttonUrl: "Button URL",
      isActive: "Status",
      createdAt: "Created At",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 30 }, // Title
      { wch: 40 }, // Subtitle
      { wch: 50 }, // Image URL
      { wch: 10 }, // Order
      { wch: 20 }, // Button Text
      { wch: 30 }, // Button URL
      { wch: 12 }, // Status
      { wch: 15 }, // Created At
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "title",
      "subtitle",
      "imageUrl",
      "orderNumber",
      "buttonText",
      "buttonUrl",
      "isActive",
      "createdAt",
    ];
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "sliders",
    transformFunction: transformSliderForExport,
  };
}
