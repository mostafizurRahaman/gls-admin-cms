// src/app/(application)/sliders/components/columns.tsx

"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { SliderDisplay } from "@/types/sliders";
import { ActionCell } from "./row-action";
import { Check, X } from "lucide-react";
import { formatDateOnly } from "@/lib/format-date";
import Image from "next/image";
import { StatusChips } from "@/components/badges/status-switcher";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined,
  onSuccess?: () => void
): ColumnDef<SliderDisplay>[] => {
  const baseColumns: ColumnDef<SliderDisplay>[] = [
    // ✅ Selection Column
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <div className="text-left max-w-xs">
          <Typography variant="Medium_H6" className="text-foreground">
            {row.getValue("title")}
          </Typography>
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: "imageUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const imageUrl = row.getValue("imageUrl") as string;
        return (
          <div className="flex justify-center items-center">
            <div className="relative w-8 h-8 rounded-full  overflow-hidden bg-muted">
              <Image
                src={imageUrl}
                alt={row.original.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.png";
                }}
              />
            </div>
          </div>
        );
      },
      size: 100,
      enableSorting: false,
    },

    {
      accessorKey: "subtitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subtitle" />
      ),
      cell: ({ row }) => {
        const subtitle = row.getValue("subtitle") as string | null;
        return (
          <div className="text-left max-w-sm">
            <Typography
              variant="Regular_H7"
              className="text-foreground truncate"
            >
              {subtitle || "—"}
            </Typography>
          </div>
        );
      },
      size: 300,
      enableSorting: false,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="font-mono">
            <Typography variant="Medium_H6">
              {row.getValue("orderNumber")}
            </Typography>
          </Badge>
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "buttonText",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Button" />
      ),
      cell: ({ row }) => {
        const buttonText = row.getValue("buttonText") as string | null;
        const buttonUrl = row.original.buttonUrl;

        if (!buttonText && !buttonUrl) {
          return (
            <div className="text-center text-foreground">
              <Typography variant="Regular_H7" className=" ">
                —
              </Typography>
            </div>
          );
        }

        return (
          <div className="text-left">
            <Typography variant="Regular_H7" className="text-foreground">
              {buttonText || "—"}
            </Typography>
          </div>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "buttonUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Button URL" />
      ),
      cell: ({ row }) => {
        const buttonUrl = row.original.buttonUrl;

        if (buttonUrl) {
          return (
            <div className="text-left text-foreground">
              <Typography variant="Regular_H7" className=" ">
                —
              </Typography>
            </div>
          );
        }

        return (
          <div className="text-left">
            <Typography variant="Regular_H7" className="text-foreground">
              {buttonUrl || "—"}
            </Typography>
          </div>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <div className="flex justify-center">
            <StatusChips status={!isActive ? "active" : "inactive"} />
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return (
          <div className="text-left">
            <Typography variant="Regular_H7" className=" ">
              {formatDateOnly(createdAt, "UTC")}
            </Typography>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "createdByUser",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created By" />
      ),
      cell: ({ row }) => {
        const createdByUser = row.getValue("createdByUser") as {
          name: string;
          email: string;
        } | null;

        if (!createdByUser) {
          return (
            <Typography variant="Regular_H7" className=" ">
              —
            </Typography>
          );
        }

        return (
          <div className="text-left">
            <Typography variant="Regular_H7" className="text-foreground">
              {createdByUser.name}
            </Typography>
            <Typography variant="Regular_H7" className="  truncate max-w-xs">
              {createdByUser.email}
            </Typography>
          </div>
        );
      },
      size: 180,
      enableSorting: false,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        return <ActionCell slider={row.original} onSuccess={onSuccess} />;
      },
      size: 80,
      enableSorting: false,
    },
  ];

  return baseColumns;
};
