// src/app/(application)/sliders/components/actions/create-slider-dialog.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { createSlider } from "@/api/sliders";
import { createSliderSchema, CreateSliderFormData } from "@/schema/sliders";
import CloudinaryUploader from "@/components/cloudinary-uploader";
import SingleImageUpload from "@/components/single-image-uploader";

interface CreateSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const CreateSliderDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateSliderDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateSliderFormData>({
    resolver: zodResolver(createSliderSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      orderNumber: 0,
      buttonUrl: "",
      buttonText: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateSliderFormData) => {
    try {
      const response = await createSlider({
        title: data.title,
        subtitle: data.subtitle || undefined,
        imageUrl: data.imageUrl,
        orderNumber: data.orderNumber || undefined,
        buttonUrl: data.buttonUrl || undefined,
        buttonText: data.buttonText || undefined,
        isActive: data.isActive,
      });

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to create slider");
      }
    } catch (error) {
      console.error("Create slider failed:", error);
      toast.error("Failed to create slider. Please try again.");
    }
  };

  // Watch the imageUrl to show current status
  const currentImageUrl = form.watch("imageUrl");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 max-h-[90vh] overflow-y-auto !max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Create New Slider
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title - Full Width */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Title *</Typography>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter slider title"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtitle - Full Width */}
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Subtitle</Typography>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter subtitle (optional)"
                      rows={2}
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Two Column Layout - Button Text and Button URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Button Text */}
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Button Text</Typography>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Learn More"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button URL - Select Dropdown */}
              <FormField
                control={form.control}
                name="buttonUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Button URL</Typography>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUTTON_URL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Two Column Layout - Order Number and Active Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Number */}
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Order Number</Typography>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : 0
                          )
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      <Typography
                        variant="Regular_H7"
                        className="text-muted-foreground"
                        as="span"
                      >
                        Leave empty to add at the end
                      </Typography>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Checkbox */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Status</Typography>
                    </FormLabel>
                    <div className="flex items-center space-x-2 h-10">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer !mt-0">
                        <Typography variant="Regular_H6">
                          Active Slider
                        </Typography>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Image Upload with Cloudinary - Full Width */}
              <Controller
                name="imageUrl"
                control={form.control}
                rules={{
                  required: "Slider image is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormItem className="!p-0 !w-full">
                    <FormControl>
                      <SingleImageUpload
                        cloudName={
                          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
                        }
                        uploadPreset={
                          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
                        }
                        label="Profile Picture"
                        shape="square"
                        maxSize={2}
                        required
                        onUpdate={(url, publicId) => {
                          console.log("Image uploaded:", url);
                        }}
                        onRemove={(publicId, url) => {
                          console.log("Image removed:", publicId);
                        }}
                      />
                    </FormControl>

                    {error && (
                      <p className="text-sm text-red-500 mt-1">
                        {error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={form.formState.isSubmitting}
                >
                  <Typography variant="Medium_H6">Cancel</Typography>
                </Button>
              </DialogClose>
              <Button
                variant="default"
                type="submit"
                disabled={form.formState.isSubmitting || !currentImageUrl}
              >
                <Typography variant="Medium_H6">
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Slider"}
                </Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSliderDialog;
