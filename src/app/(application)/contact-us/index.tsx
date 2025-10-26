"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useContactUsData } from "./utils/data-fetching";
import { ToolbarOptions } from "./components/toolbar-options";
import { ContactInquiry } from "@/types";
import { getBulkContactUsForExport } from "@/api/contact-us";
import { formatDateOnly } from "@/lib/format-date";

interface ContactUsExportData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

const fetchByIdsFn = async (
  ids: string[] | number[]
): Promise<ContactUsExportData[]> => {
  const stringIds = ids.map((id) => String(id));
  const inquiries = await getBulkContactUsForExport({ ids: stringIds });

  return (
    inquiries?.map((inquiry: ContactInquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || "",
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      images: inquiry.images || [],
      createdAt: inquiry.createdAt ? formatDateOnly(inquiry.createdAt) : "",
      updatedAt: inquiry.updatedAt ? formatDateOnly(inquiry.updatedAt) : "",
    })) || []
  );
};

export default function ContactUsTable() {
  const exportConfig = useExportConfig();

  return (
    <DataTable<ContactUsExportData, unknown>
      getColumns={getColumns}
      exportConfig={exportConfig}
      fetchDataFn={useContactUsData}
      fetchByIdsFn={fetchByIdsFn}
      idField="id"
      pageSizeOptions={[2, 5, 10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedInquiries={selectedRows.map((row) => ({
            id: row.id,
            name: row.name,
          }))}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "contact-us-table",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
