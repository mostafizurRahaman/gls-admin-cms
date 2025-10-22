// src/app/(application)/sliders/components/actions/edit-slider-dialog.tsx

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { Slider, SliderFormData } from "@/types/sliders";
import { updateSlider } from "@/api/sliders";

interface EditSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slider: Slider;
  onSuccess?: () => void;
}

// Button URL options
const BUTTON_URL_OPTIONS = [
  { value: "/about-us", label: "About us page" },
  { value: "/book-appointment", label: "Book appointment page" },
  { value: "/contact-us", label: "Contact us page" },
  { value: "/gallery", label: "Gallery page" },
  { value: "/get-quatation", label: "Get quotation page" },
  { value: "/services", label: "Services page" },
];

const EditSliderDialog = ({
  open,
  onOpenChange,
  slider,
  onSuccess,
}: EditSliderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SliderFormData>({
    title: "",
    subtitle: "",
    imageUrl: "",
    orderNumber: 1,
    buttonUrl: "",
    buttonText: "",
    isActive: true,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (slider) {
      setFormData({
        title: slider.title,
        subtitle: slider.subtitle || "",
        imageUrl: slider.imageUrl,
        orderNumber: slider.orderNumber,
        buttonUrl: slider.buttonUrl || "",
        buttonText: slider.buttonText || "",
        isActive: slider.isActive,
      });
    }
  }, [slider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Don't send orderNumber in update (use separate swap API)
      const { orderNumber, ...updateData } = formData;

      const response = await updateSlider(slider.id, updateData);

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to update slider");
      }
    } catch (error) {
      console.error("Update slider failed:", error);
      toast.error("Failed to update slider. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Edit Slider
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="title">
              <Typography variant="Medium_H6">Title *</Typography>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter slider title"
              required
            />
          </div>

          {/* Subtitle - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">
              <Typography variant="Medium_H6">Subtitle</Typography>
            </Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="Enter subtitle (optional)"
              rows={2}
            />
          </div>

          {/* Image URL - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">
              <Typography variant="Medium_H6">Image URL *</Typography>
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              type="url"
              required
            />
          </div>

          {/* Two Column Layout - Button Text and Button URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Button Text */}
            <div className="space-y-2">
              <Label htmlFor="buttonText">
                <Typography variant="Medium_H6">Button Text</Typography>
              </Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                placeholder="Learn More"
              />
            </div>

            {/* Button URL - Select Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="buttonUrl">
                <Typography variant="Medium_H6">Button URL</Typography>
              </Label>
              <Select
                value={formData.buttonUrl}
                onValueChange={(value) =>
                  setFormData({ ...formData, buttonUrl: value })
                }
              >
                <SelectTrigger id="buttonUrl">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {BUTTON_URL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Two Column Layout - Order Number and Active Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Number (Display Only) */}
            <div className="space-y-2">
              <Label htmlFor="orderNumber">
                <Typography variant="Medium_H6">Order Number</Typography>
              </Label>
              <Input
                id="orderNumber"
                type="number"
                value={formData.orderNumber}
                disabled
                className="bg-muted"
              />
              <Typography
                variant="Regular_H7"
                className="text-muted-foreground"
              >
                Use Swap Order action to modify the order
              </Typography>
            </div>

            {/* Active Checkbox */}
            <div className="space-y-2">
              <Label>
                <Typography variant="Medium_H6">Status</Typography>
              </Label>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  <Typography variant="Regular_H6">Active Slider</Typography>
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                <Typography variant="Medium_H6">Cancel</Typography>
              </Button>
            </DialogClose>
            <Button variant="default" type="submit" disabled={isLoading}>
              <Typography variant="Medium_H6">
                {isLoading ? "Saving..." : "Save Changes"}
              </Typography>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSliderDialog;
