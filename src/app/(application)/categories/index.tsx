// src/api/categories/index.tsx
"use client";

import { DataTable } from "@/components/data-table/data-table";
import { ToolbarOptions } from "./components/toolbar-options";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useCategoriesData, fetchCategoriesByIds } from "./utils/data-fetching";
import { CategoryDisplay } from "@/types";

const CategoriesDataTable = () => {
  return (
    <DataTable<CategoryDisplay, unknown>
      getColumns={getColumns}
      fetchDataFn={useCategoriesData}
      fetchByIdsFn={fetchCategoriesByIds}
      exportConfig={useExportConfig()}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50]}
      renderToolbarContent={({
        selectedRows,
        allSelectedIds,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedCategories={selectedRows.map((row) => ({
            id: row.id,
            name: row.name,
          }))}
          allSelectedCategoryIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: false,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "categories",
        defaultSortBy: "sortOrder",
        defaultSortOrder: "asc",
      }}
    />
  );
};

export default CategoriesDataTable;
