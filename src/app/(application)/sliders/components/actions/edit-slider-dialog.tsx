import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { updateSlider } from "@/api/sliders";
import {
  updateSliderSchema,
  UpdateSliderFormData,
  Slider,
} from "@/schema/sliders";
import SingleImageUpload from "@/components/single-image-uploader";

interface EditSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slider: Slider;
  onSuccess?: () => void;
}

export const EditSliderDialog = ({
  open,
  onOpenChange,
  slider,
  onSuccess,
}: EditSliderDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateSliderFormData>({
    resolver: zodResolver(updateSliderSchema),
    defaultValues: {
      title: slider.title,
      subtitle: slider.subtitle || "",
      image: slider.image
        ? {
            url: slider.image.url,
            publicId: slider.image.publicId || undefined,
            folder: slider.image.folder || undefined,
            altText: slider.image.altText || undefined,
            width: slider.image.width || undefined,
            height: slider.image.height || undefined,
            format: slider.image.format || undefined,
            size: slider.image.size || undefined,
          }
        : undefined,
      orderNumber: slider.orderNumber,
      buttonUrl: slider.buttonUrl || "",
      buttonText: slider.buttonText || "",
      isActive: slider.isActive,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: slider.title,
        subtitle: slider.subtitle || "",
        image: slider.image
          ? {
              url: slider.image.url,
              publicId: slider.image.publicId || undefined,
              folder: slider.image.folder || undefined,
              altText: slider.image.altText || undefined,
              width: slider.image.width || undefined,
              height: slider.image.height || undefined,
              format: slider.image.format || undefined,
              size: slider.image.size || undefined,
            }
          : undefined,
        orderNumber: slider.orderNumber,
        buttonUrl: slider.buttonUrl || "",
        buttonText: slider.buttonText || "",
        isActive: slider.isActive,
      });
    }
  }, [open, slider, form]);

  const onSubmit = async (data: UpdateSliderFormData) => {
    try {
      const response = await updateSlider(slider.id, data);

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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 max-h-[90vh] overflow-y-auto !max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Edit Slider
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="buttonUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Button URL</Typography>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/services"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Slider Image *</Typography>
                  </FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      value={field.value?.url || ""}
                      onChange={(url, metadata) => {
                        if (url) {
                          field.onChange({
                            url,
                            publicId: metadata?.publicId || undefined,
                            folder: metadata?.folder || "app/hero-sliders",
                            altText:
                              metadata?.altText || form.getValues("title"),
                            width: metadata?.width,
                            height: metadata?.height,
                            format: metadata?.format,
                            size: metadata?.size,
                          });
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      folder="app/hero-sliders"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={form.formState.isSubmitting}
              >
                <Typography variant="Medium_H6">
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
