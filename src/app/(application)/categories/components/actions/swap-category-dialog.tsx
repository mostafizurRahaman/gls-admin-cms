// src/api/categories/components/actions/swap-order-dialog.tsx
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

interface SwapOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  currentOrder: number;
  onSuccess?: () => void;
}

const SwapOrderDialog = ({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  currentOrder,
  onSuccess,
}: SwapOrderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newOrder, setNewOrder] = useState(currentOrder);
  const queryClient = useQueryClient();

  const handleSwap = async () => {
    try {
      setIsLoading(true);

      if (newOrder === currentOrder) {
        toast.info("Please enter a different order number");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success response
      const response = {
        success: true,
        message: `Order changed from ${currentOrder} to ${newOrder}`,
      };

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Failed to swap order");
      }
    } catch (error) {
      console.error("Swap order failed:", error);
      toast.error("Failed to swap order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4">Change Sort Order</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6" className="text-muted-foreground">
              Change the sort order for{" "}
              <span className="text-primary font-medium">{categoryName}</span>
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
            <Label htmlFor="newOrder">
              <Typography variant="Medium_H6">New Order *</Typography>
            </Label>
            <Input
              id="newOrder"
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(Number(e.target.value))}
              placeholder="Enter new order"
              min="1"
              required
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              <Typography variant="Medium_H6">Cancel</Typography>
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleSwap}
            type="button"
            disabled={isLoading}
          >
            <Typography variant="Medium_H6">Change Order</Typography>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapOrderDialog;
