// src/api/categories/components/columns.tsx
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/typography";
import { CategoryDisplay } from "@/types";
import { ActionCell } from "./row-action";
import { Check, X } from "lucide-react";
import { formatDateOnly } from "@/lib/format-date";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined,
  onSuccess?: () => void
): ColumnDef<CategoryDisplay>[] => {
  const baseColumns: ColumnDef<CategoryDisplay>[] = [
    {
      accessorKey: "sortOrder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="font-mono">
            <Typography variant="Medium_H6">
              {row.getValue("sortOrder")}
            </Typography>
          </Badge>
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="text-left">
          <Typography variant="Medium_H6" className="text-foreground">
            {row.getValue("name")}
          </Typography>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tagline" />
      ),
      cell: ({ row }) => (
        <div className="text-left max-w-xs">
          <Typography
            variant="Regular_H7"
            className="text-muted-foreground truncate"
          >
            {row.getValue("tagline")}
          </Typography>
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="text-left max-w-md">
            <Typography
              variant="Regular_H7"
              className="text-muted-foreground line-clamp-2"
            >
              {description}
            </Typography>
          </div>
        );
      },
      size: 300,
      enableSorting: false,
    },
    {
      accessorKey: "addons",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Addons" />
      ),
      cell: ({ row }) => {
        const addons = row.getValue("addons") as string[];
        return (
          <div className="flex flex-wrap gap-1 max-w-sm">
            {addons.slice(0, 2).map((addon, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Typography variant="Regular_H7">{addon}</Typography>
              </Badge>
            ))}
            {addons.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                <Typography variant="Regular_H7">
                  +{addons.length - 2} more
                </Typography>
              </Badge>
            )}
          </div>
        );
      },
      size: 300,
      enableSorting: false,
    },
    {
      accessorKey: "isPremium",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Premium" />
      ),
      cell: ({ row }) => {
        const isPremium = row.getValue("isPremium") as boolean;
        return (
          <div className="flex justify-center">
            {isPremium ? (
              <Badge className="bg-status-success/10 text-status-success hover:bg-status-success/20">
                <Check className="w-3 h-3 mr-1" />
                <Typography variant="Medium_H7">Yes</Typography>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                <X className="w-3 h-3 mr-1" />
                <Typography variant="Medium_H7">No</Typography>
              </Badge>
            )}
          </div>
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
        const isRepairing = row.getValue("isRepairingService") as boolean;
        return (
          <div className="flex justify-center">
            {isRepairing ? (
              <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                <Check className="w-3 h-3 mr-1" />
                <Typography variant="Medium_H7">Yes</Typography>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                <X className="w-3 h-3 mr-1" />
                <Typography variant="Medium_H7">No</Typography>
              </Badge>
            )}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "isShowHome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Show Home" />
      ),
      cell: ({ row }) => {
        const isShowHome = row.getValue("isShowHome") as boolean;
        return (
          <div className="flex justify-center">
            {isShowHome ? (
              <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">
                <Check className="w-3 h-3 mr-1" />
                <Typography variant="Medium_H7">Yes</Typography>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                <X className="w-3 h-3 mr-1" />
                <Typography variant="Medium_H7">No</Typography>
              </Badge>
            )}
          </div>
        );
      },
      size: 120,
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
            <Typography variant="Regular_H7" className="text-muted-foreground">
              {formatDateOnly(createdAt, "UTC")}
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
      cell: ({ row }) => {
        return <ActionCell category={row.original} onSuccess={onSuccess} />;
      },
      size: 80,
      enableSorting: false,
    },
  ];

  return baseColumns;
};
