import React from "react";
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
  FormDescription,
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
import { createSlider } from "@/api/sliders";
import {
  createSliderFormSchema,
  CreateSliderFormData,
  CreateSliderApiData,
} from "@/schema/sliders";
import SingleImageUpload from "@/components/single-image-uploader";

interface CreateSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateSliderDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateSliderDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateSliderFormData>({
    resolver: zodResolver(createSliderFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      image: undefined,
      orderNumber: undefined,
      buttonUrl: "",
      buttonText: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateSliderFormData) => {
    try {
      if (!data.image) {
        toast.error("Image is required");
        return;
      }

      const apiData: CreateSliderApiData = {
        ...data,
        image: data.image,
      };

      const response = await createSlider(apiData);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 max-h-[90vh] overflow-y-auto !max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Create New Slider
            </Typography>
          </DialogTitle>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
            <Typography variant="Regular_H7" className="text-blue-800">
              <strong>Note:</strong> Maximum of 15 sliders allowed. Please
              delete existing sliders if you need to add more.
            </Typography>
          </div>
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
                            publicId: metadata?.publicId || "",
                            folder: "app/hero-sliders",
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
