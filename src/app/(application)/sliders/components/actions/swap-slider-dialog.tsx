// src/app/(application)/sliders/components/actions/swap-slider-dialog.tsx

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { swapSliders } from "@/api/sliders";

interface SwapSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sliderId: number;
  sliderTitle: string;
  currentOrder: number;
  onSuccess?: () => void;
}

const SwapSliderDialog = ({
  open,
  onOpenChange,
  sliderId,
  sliderTitle,
  currentOrder,
  onSuccess,
}: SwapSliderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [targetSliderId, setTargetSliderId] = useState<number | "">("");
  const queryClient = useQueryClient();

  const handleSwap = async () => {
    try {
      setIsLoading(true);

      if (!targetSliderId) {
        toast.error("Please enter a target slider ID");
        return;
      }

      if (targetSliderId === sliderId) {
        toast.error("Cannot swap slider with itself");
        return;
      }

      const response = await swapSliders({
        sliderId1: sliderId,
        sliderId2: targetSliderId,
      });

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        setTargetSliderId("");
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to swap sliders");
      }
    } catch (error) {
      console.error("Swap sliders failed:", error);
      toast.error("Failed to swap sliders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Swap Slider Order
            </Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography
              variant="Regular_H6"
              className="text-muted-foreground"
              as="span"
            >
              Swap the order of{" "}
              <span className="text-primary font-medium">{sliderTitle}</span>{" "}
              with another slider
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentOrder">
              <Typography variant="Medium_H6">Current Order</Typography>
            </Label>
            <Input
              id="currentOrder"
              value={currentOrder}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetSliderId">
              <Typography variant="Medium_H6">Target Slider ID *</Typography>
            </Label>
            <Input
              id="targetSliderId"
              type="number"
              value={targetSliderId}
              onChange={(e) =>
                setTargetSliderId(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Enter slider ID to swap with"
              min="1"
              required
            />
            <Typography variant="Regular_H7" className="text-muted-foreground">
              Enter the ID of the slider you want to swap order with
            </Typography>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isLoading}>
              <Typography variant="Medium_H6">Cancel</Typography>
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleSwap}
            type="button"
            disabled={isLoading}
          >
            <Typography variant="Medium_H6">
              {isLoading ? "Swapping..." : "Swap Order"}
            </Typography>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapSliderDialog;
