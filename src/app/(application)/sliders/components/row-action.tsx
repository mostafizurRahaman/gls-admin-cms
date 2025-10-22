// src/app/(application)/sliders/components/row-action.tsx

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
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { Typography } from "@/components/typography";
import DeleteSliderDialog from "./actions/delete-slider-dialog";
import EditSliderDialog from "./actions/edit-slider-dialog";
import SwapSliderDialog from "./actions/swap-slider-dialog";
import { Slider } from "@/types/sliders";

export interface ActionCellProps {
  slider: Slider;
  onSuccess?: () => void;
}

export const ActionCell: React.FC<ActionCellProps> = ({
  slider,
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
            onClick={() => window.open(slider.imageUrl, "_blank")}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            <Typography variant="Regular_H6">View Image</Typography>
          </DropdownMenuItem>
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
            <Typography variant="Regular_H6">Swap Order</Typography>
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
      <DeleteSliderDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        sliderId={slider.id}
        sliderTitle={slider.title}
        onSuccess={onSuccess}
      />

      {/* Edit Dialog */}
      <EditSliderDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        slider={slider}
        onSuccess={onSuccess}
      />

      {/* Swap Dialog */}
      <SwapSliderDialog
        open={showSwapDialog}
        onOpenChange={setShowSwapDialog}
        sliderId={slider.id}
        sliderTitle={slider.title}
        currentOrder={slider.orderNumber}
        onSuccess={onSuccess}
      />
    </>
  );
};
