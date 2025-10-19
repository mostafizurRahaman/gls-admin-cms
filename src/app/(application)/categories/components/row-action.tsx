// src/api/categories/components/row-action.tsx
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Typography } from "@/components/typography";
import DeleteCategoryDialog from "./actions/delete-category-dialog";
import EditCategoryDialog from "./actions/edit-category-dialog";
import SwapOrderDialog from "./actions/swap-category-dialog";
import { Category } from "@/types";

export interface ActionCellProps {
  category: Category;
  onSuccess?: () => void;
}

export const ActionCell: React.FC<ActionCellProps> = ({
  category,
  onSuccess,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSwapDialog, setShowSwapDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <Typography variant="Medium_H6">Actions</Typography>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowEditDialog(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            <Typography variant="Regular_H6">Edit</Typography>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowSwapDialog(true)}
            className="cursor-pointer"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <Typography variant="Regular_H6">Change Order</Typography>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <Typography variant="Regular_H6">Delete</Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        categoryId={category.id}
        categoryName={category.name}
        onSuccess={onSuccess}
      />

      {/* Edit Dialog */}
      <EditCategoryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        category={category}
        onSuccess={onSuccess}
      />

      {/* Swap Order Dialog */}
      <SwapOrderDialog
        open={showSwapDialog}
        onOpenChange={setShowSwapDialog}
        categoryId={category.id}
        categoryName={category.name}
        currentOrder={category.sortOrder}
        onSuccess={onSuccess}
      />
    </>
  );
};
