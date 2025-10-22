import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./row-action";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Flattened type for export (only primitive types)
type SliderExportData = {
  id: number;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  isActive: boolean;
  orderNumber: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export const getColumns = (
  handleRowDeselection?: ((rowId: string) => void) | null
): ColumnDef<SliderExportData>[] => {
  const baseColumns: ColumnDef<SliderExportData>[] = [
    {
      accessorKey: "imageUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const imageUrl = row.original.imageUrl;
        const title = row.original.title;
        return imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Slider image"}
            width={80}
            height={45}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="h-10 w-20 bg-gray-100 rounded-md flex items-center justify-center">
            <Typography variant="Regular_H7" className="text-gray-400">
              No Image
            </Typography>
          </div>
        );
      },
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">{row.getValue("title")}</Typography>
      ),
      size: 250,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">
          {row.getValue("orderNumber")}
        </Typography>
      ),
      size: 80,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <Typography variant="Regular_H7">
            {format(date, "MMM d, yyyy")}
          </Typography>
        );
      },
      size: 150,
    },
    {
      id: "actions",
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      enableSorting: false,
      enableHiding: false,
      size: 80,
    },
  ];

  if (handleRowDeselection) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              if (!value) {
                handleRowDeselection(row.id);
              }
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  return baseColumns;
};
