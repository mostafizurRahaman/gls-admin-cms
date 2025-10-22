// src/app/(application)/sliders/components/actions/bulk-delete-sliders-dialog.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { deleteSlider } from "@/api/sliders";

interface BulkDeleteSlidersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSliderIds: number[];
  selectedCount: number;
  resetSelection: () => void;
  onSuccess?: () => void;
}

const BulkDeleteSlidersDialog = ({
  open,
  onOpenChange,
  selectedSliderIds,
  selectedCount,
  resetSelection,
  onSuccess,
}: BulkDeleteSlidersDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleBulkDelete = async () => {
    try {
      setIsLoading(true);

      let successCount = 0;
      let failCount = 0;

      // Delete each slider
      for (const id of selectedSliderIds) {
        try {
          const response = await deleteSlider(id);
          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} slider(s)`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} slider(s)`);
      }

      queryClient.invalidateQueries({ queryKey: ["sliders"] });
      resetSelection();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Failed to delete sliders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Delete Multiple Sliders?
            </Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography
              variant="Regular_H6"
              className="text-muted-foreground"
              as="span"
            >
              Are you sure you want to delete{" "}
              <span className="text-destructive font-medium">
                {selectedCount}
              </span>{" "}
              slider(s)? This action cannot be undone.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isLoading}>
              <Typography variant="Medium_H6">Cancel</Typography>
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            type="button"
            disabled={isLoading}
          >
            <Typography variant="Medium_H6">
              {isLoading ? "Deleting..." : `Delete ${selectedCount} Slider(s)`}
            </Typography>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteSlidersDialog;
