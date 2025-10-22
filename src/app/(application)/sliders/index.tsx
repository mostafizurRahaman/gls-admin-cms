// src/app/(application)/sliders/index.tsx

"use client";

import { DataTable } from "@/components/data-table/data-table";
import { ToolbarOptions } from "./components/toolbar-options";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useSlidersData, fetchSlidersByIds } from "./utils/data-fetching";
import { SliderDisplay } from "@/types/sliders";

const SlidersDataTable = () => {
  return (
    <DataTable<SliderDisplay, unknown>
      getColumns={getColumns}
      fetchDataFn={useSlidersData}
      fetchByIdsFn={fetchSlidersByIds}
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
          selectedSliders={selectedRows.map((row) => ({
            id: row.id,
            title: row.title,
          }))}
          allSelectedSliderIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true, // ✅ Changed to true
        enableClickRowSelect: false, // Keep false to only select via checkbox
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "sliders",
        defaultSortBy: "orderNumber",
        defaultSortOrder: "asc",
      }}
    />
  );
};

export default SlidersDataTable;
