"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/typography";
import { Category, CategoryExportData } from "@/types/category";
import { DataTableRowActions } from "./row-actions";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<CategoryExportData>[] => {
  const baseColumns: ColumnDef<CategoryExportData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          <Typography variant="Medium_H6">{row.getValue("name")}</Typography>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tagline" />
      ),
      cell: ({ row }) => {
        const tagline = row.getValue("tagline") as string;
        return (
          <div className="max-w-[200px]">
            <Typography
              variant="Regular_H7"
              className="text-gray-600"
              maxLines={2}
            >
              {tagline || "—"}
            </Typography>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            <Typography variant="Regular_H7">
              {isActive ? "Active" : "Inactive"}
            </Typography>
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: "isPremium",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Premium" />
      ),
      cell: ({ row }) => {
        const isPremium = row.getValue("isPremium") as boolean;
        return (
          <Badge variant={isPremium ? "default" : "outline"}>
            <Typography variant="Regular_H7">
              {isPremium ? "Premium" : "Standard"}
            </Typography>
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: "isRepairingService",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Repair Service" />
      ),
      cell: ({ row }) => {
        const isRepairingService = row.getValue(
          "isRepairingService"
        ) as boolean;
        return (
          <Badge variant={isRepairingService ? "default" : "outline"}>
            <Typography variant="Regular_H7">
              {isRepairingService ? "Yes" : "No"}
            </Typography>
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: "isShowHome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Show on Home" />
      ),
      cell: ({ row }) => {
        const isShowHome = row.getValue("isShowHome") as boolean;
        return (
          <Badge variant={isShowHome ? "default" : "outline"}>
            <Typography variant="Regular_H7">
              {isShowHome ? "Yes" : "No"}
            </Typography>
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: "sortOrder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Typography variant="Regular_H7">
            {row.getValue("sortOrder")}
          </Typography>
        </div>
      ),
      size: 80,
      enableSorting: false,
    },
    {
      accessorKey: "_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Services" />
      ),
      cell: ({ row }) => {
        const count = row.getValue("_count") as
          | { services: number }
          | undefined;
        return (
          <div className="text-center">
            <Typography variant="Regular_H7">{count?.services || 0}</Typography>
          </div>
        );
      },
      size: 80,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div>
            <Typography variant="Regular_H7">
              {format(date, "MMM d, yyyy")}
            </Typography>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      size: 100,
    },
  ];

  // Only include selection column if row selection is enabled
  if (handleRowDeselection !== null) {
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
            className="translate-y-0.5 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              if (!value && handleRowDeselection) {
                handleRowDeselection(row.id);
              }
            }}
            aria-label="Select row"
            className="translate-y-0.5 cursor-pointer"
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
