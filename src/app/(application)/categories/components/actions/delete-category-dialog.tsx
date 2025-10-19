// src/api/categories/components/actions/delete-category-dialog.tsx
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

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
}

const DeleteCategoryDialog = ({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  onSuccess,
}: DeleteCategoryDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success response
      const response = {
        success: true,
        message: "Category deleted successfully",
      };

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Delete category failed:", error);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4">Delete Category?</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6" className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="text-primary font-medium">{categoryName}</span>?
              This action cannot be undone.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              <Typography variant="Medium_H6">Cancel</Typography>
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            type="button"
            disabled={isLoading}
          >
            <Typography variant="Medium_H6">Delete</Typography>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
