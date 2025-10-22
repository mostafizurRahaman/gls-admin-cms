// src/app/(application)/sliders/utils/data-fetching.ts

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { preprocessSearch } from "@/components/data-table/utils";
import { Slider, SliderDisplay } from "@/types/sliders";
import { getAllSliders } from "@/api/sliders";

/**
 * Maps frontend column sort keys to backend API sort parameters
 */
const mapSortKeyToBackend = (frontendSortKey: string): string => {
  const mapping: Record<string, string> = {
    title: "title",
    orderNumber: "orderNumber",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    isActive: "isActive",
  };

  return mapping[frontendSortKey] || "orderNumber";
};

/**
 * Transform Slider to SliderDisplay for DataTable compatibility
 */
function transformSliderItem(slider: Slider): SliderDisplay {
  return {
    ...slider,
  };
}

/**
 * Hook to fetch sliders with the current filters and pagination
 */
export function useSlidersData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  return useQuery({
    queryKey: [
      "sliders",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],

    queryFn: async () => {
      // Calculate offset from page number
      const offset = (page - 1) * pageSize;

      // Call the API
      const response = await getAllSliders({
        // Get all sliders (active and inactive)
        sort: sortOrder as "asc" | "desc",
        limit: pageSize,
        offset: offset,
      });

      if (!response.success || !response.data) {
        throw new Error("Failed to fetch sliders");
      }

      const { sliders, pagination } = response.data;

      // Transform sliders for display
      const transformedSliders = sliders.map(transformSliderItem);

      // Apply client-side search filter if search term exists
      let filteredSliders = transformedSliders;
      if (search) {
        const searchLower = preprocessSearch(search).toLowerCase();
        filteredSliders = transformedSliders.filter(
          (slider) =>
            slider.title.toLowerCase().includes(searchLower) ||
            slider.subtitle?.toLowerCase().includes(searchLower) ||
            slider.buttonText?.toLowerCase().includes(searchLower)
        );
      }

      // Apply date range filter if provided
      if (dateRange.from_date && dateRange.to_date) {
        const fromDate = new Date(dateRange.from_date);
        const toDate = new Date(dateRange.to_date);
        filteredSliders = filteredSliders.filter((slider) => {
          const sliderDate = new Date(slider.createdAt);
          return sliderDate >= fromDate && sliderDate <= toDate;
        });
      }

      return {
        success: true,
        data: filteredSliders,
        pagination: {
          page: page,
          limit: pageSize,
          total: pagination.total,
          totalPages: Math.ceil(pagination.total / pageSize),
        },
      };
    },

    placeholderData: keepPreviousData,
  });
}

// Add a property to the function so we can use it with the DataTable component
useSlidersData.isQueryHook = true;

/**
 * Fetch sliders by IDs (for export functionality)
 */
export async function fetchSlidersByIds(
  ids: string[] | number[]
): Promise<SliderDisplay[]> {
  // Get all sliders
  const response = await getAllSliders({
    sort: "asc",
  });

  if (!response.success || !response.data) {
    throw new Error("Failed to fetch sliders");
  }

  const { sliders } = response.data;

  // Filter by IDs
  const numberIds = ids.map((id) => Number(id));
  const filteredSliders = sliders.filter((slider) =>
    numberIds.includes(slider.id)
  );

  return filteredSliders.map(transformSliderItem);
}
