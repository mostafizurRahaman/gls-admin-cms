// src/api/categories/components/actions/edit-category-dialog.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { Category, CategoryFormData } from "@/types";
import { X } from "lucide-react";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  onSuccess?: () => void;
}

const EditCategoryDialog = ({
  open,
  onOpenChange,
  category,
  onSuccess,
}: EditCategoryDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    tagline: "",
    description: "",
    cardBannerUrl: "",
    detailsBannerUrl: "",
    isPremium: false,
    isRepairingService: false,
    isShowHome: false,
    sortOrder: 0,
    addons: [],
  });
  const [newAddon, setNewAddon] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        tagline: category.tagline,
        description: category.description,
        cardBannerUrl: category.cardBannerUrl,
        detailsBannerUrl: category.detailsBannerUrl,
        isPremium: category.isPremium,
        isRepairingService: category.isRepairingService,
        isShowHome: category.isShowHome,
        sortOrder: category.sortOrder,
        addons: category.addons,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success response
      const response = {
        success: true,
        message: "Category updated successfully",
      };

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      console.error("Update category failed:", error);
      toast.error("Failed to update category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddon = () => {
    if (newAddon.trim() && !formData.addons.includes(newAddon.trim())) {
      setFormData({
        ...formData,
        addons: [...formData.addons, newAddon.trim()],
      });
      setNewAddon("");
    }
  };

  const handleRemoveAddon = (addon: string) => {
    setFormData({
      ...formData,
      addons: formData.addons.filter((a) => a !== addon),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4">Edit Category</Typography>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              <Typography variant="Medium_H6">Name *</Typography>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">
              <Typography variant="Medium_H6">Tagline *</Typography>
            </Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              placeholder="Enter tagline"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              <Typography variant="Medium_H6">Description *</Typography>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description"
              rows={4}
              required
            />
          </div>

          {/* Card Banner URL */}
          <div className="space-y-2">
            <Label htmlFor="cardBannerUrl">
              <Typography variant="Medium_H6">Card Banner URL</Typography>
            </Label>
            <Input
              id="cardBannerUrl"
              value={formData.cardBannerUrl}
              onChange={(e) =>
                setFormData({ ...formData, cardBannerUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          {/* Details Banner URL */}
          <div className="space-y-2">
            <Label htmlFor="detailsBannerUrl">
              <Typography variant="Medium_H6">Details Banner URL</Typography>
            </Label>
            <Input
              id="detailsBannerUrl"
              value={formData.detailsBannerUrl}
              onChange={(e) =>
                setFormData({ ...formData, detailsBannerUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">
              <Typography variant="Medium_H6">Sort Order *</Typography>
            </Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: Number(e.target.value) })
              }
              placeholder="1"
              min="1"
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPremium: checked as boolean })
                }
              />
              <Label htmlFor="isPremium" className="cursor-pointer">
                <Typography variant="Regular_H6">Premium Category</Typography>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRepairingService"
                checked={formData.isRepairingService}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isRepairingService: checked as boolean,
                  })
                }
              />
              <Label htmlFor="isRepairingService" className="cursor-pointer">
                <Typography variant="Regular_H6">Repairing Service</Typography>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isShowHome"
                checked={formData.isShowHome}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isShowHome: checked as boolean })
                }
              />
              <Label htmlFor="isShowHome" className="cursor-pointer">
                <Typography variant="Regular_H6">Show on Home Page</Typography>
              </Label>
            </div>
          </div>

          {/* Addons */}
          <div className="space-y-2">
            <Label htmlFor="addons">
              <Typography variant="Medium_H6">Addons</Typography>
            </Label>
            <div className="flex gap-2">
              <Input
                id="addons"
                value={newAddon}
                onChange={(e) => setNewAddon(e.target.value)}
                placeholder="Add addon"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAddon();
                  }
                }}
              />
              <Button type="button" onClick={handleAddAddon} variant="outline">
                <Typography variant="Medium_H6">Add</Typography>
              </Button>
            </div>

            {/* Addon List */}
            {formData.addons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.addons.map((addon, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    <Typography variant="Regular_H7">{addon}</Typography>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addon)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                <Typography variant="Medium_H6">Cancel</Typography>
              </Button>
            </DialogClose>
            <Button variant="default" type="submit" disabled={isLoading}>
              <Typography variant="Medium_H6">Save Changes</Typography>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
