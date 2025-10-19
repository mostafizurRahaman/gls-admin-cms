// src/api/categories/utils/data-fetching.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { preprocessSearch } from "@/components/data-table/utils";
import { Category, CategoryDisplay } from "@/types";
import { categories } from "../dummy-data";

/**
 * Simulates API delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Maps frontend column sort keys to backend API sort parameters
 */
const mapSortKeyToBackend = (frontendSortKey: string): keyof Category => {
  const mapping: Record<string, keyof Category> = {
    name: "name",
    sortOrder: "sortOrder",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    isPremium: "isPremium",
  };

  return mapping[frontendSortKey] || "sortOrder";
};

/**
 * Transform Category to CategoryDisplay for DataTable compatibility
 */
function transformCategoryItem(category: Category): CategoryDisplay {
  return {
    ...category,
  };
}

/**
 * Dummy fetch function that simulates API call
 */
async function fetchCategoriesData(params: {
  page: number;
  limit: number;
  search: string;
  from_date: string;
  to_date: string;
  sort_by: keyof Category;
  sort_order: "asc" | "desc";
}) {
  // Simulate API delay
  await delay(500);

  let filteredCategories = [...categories];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredCategories = filteredCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchLower) ||
        cat.tagline.toLowerCase().includes(searchLower) ||
        cat.description.toLowerCase().includes(searchLower) ||
        cat.addons.some((addon) => addon.toLowerCase().includes(searchLower))
    );
  }

  // Apply date range filter
  if (params.from_date && params.to_date) {
    const fromDate = new Date(params.from_date);
    const toDate = new Date(params.to_date);
    filteredCategories = filteredCategories.filter((cat) => {
      const catDate = new Date(cat.createdAt);
      return catDate >= fromDate && catDate <= toDate;
    });
  }

  // Apply sorting
  filteredCategories.sort((a, b) => {
    const aValue = a[params.sort_by];
    const bValue = b[params.sort_by];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return params.sort_order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return params.sort_order === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Apply pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedCategories.map(transformCategoryItem),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: filteredCategories.length,
      totalPages: Math.ceil(filteredCategories.length / params.limit),
    },
  };
}

/**
 * Hook to fetch categories with the current filters and pagination
 */
export function useCategoriesData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  return useQuery({
    queryKey: [
      "categories",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],

    queryFn: async () => {
      return await fetchCategoriesData({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        sort_by: mapSortKeyToBackend(sortBy || "sortOrder"),
        sort_order: sortOrder as "asc" | "desc",
      });
    },

    placeholderData: keepPreviousData,
  });
}

// Add a property to the function so we can use it with the DataTable component
useCategoriesData.isQueryHook = true;

/**
 * Fetch categories by IDs (for export functionality)
 */
export async function fetchCategoriesByIds(
  ids: string[] | number[]
): Promise<CategoryDisplay[]> {
  const stringIds = ids?.map((id) => String(id));
  await delay(300);

  const filteredCategories = categories.filter((cat) =>
    stringIds.includes(cat.id)
  );
  return filteredCategories.map(transformCategoryItem);
}
