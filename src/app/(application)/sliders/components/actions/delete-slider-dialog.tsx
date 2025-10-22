// src/app/(application)/sliders/components/actions/delete-slider-dialog.tsx

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

interface DeleteSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sliderId: number;
  sliderTitle: string;
  onSuccess?: () => void;
}

const DeleteSliderDialog = ({
  open,
  onOpenChange,
  sliderId,
  sliderTitle,
  onSuccess,
}: DeleteSliderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response = await deleteSlider(sliderId);

      if (response.success) {
        toast.success(response.message);

        // Show additional info about normalization
        if (response.data?.normalized) {
          toast.info(
            `${response.data.totalRemaining} sliders remaining and reordered`
          );
        }

        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to delete slider");
      }
    } catch (error) {
      console.error("Delete slider failed:", error);
      toast.error("Failed to delete slider. Please try again.");
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
              Delete Slider?
            </Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography
              variant="Regular_H6"
              className="text-muted-foreground"
              as="span"
            >
              Are you sure you want to delete{" "}
              <span className="text-primary font-medium">{sliderTitle}</span>?
              This action cannot be undone.
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
            onClick={handleDelete}
            type="button"
            disabled={isLoading}
          >
            <Typography variant="Medium_H6">
              {isLoading ? "Deleting..." : "Delete"}
            </Typography>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSliderDialog;
