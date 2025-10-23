import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";
import {
  uploadToCloudinaryDirect,
  validateFile,
  deleteFromCloudinary,
} from "@/lib/cloudinary-utils";

// ✅ Image metadata interface
export interface ImageMetadata {
  publicId?: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

interface SingleImageUploadProps {
  onImageSelect?: (file: File | null) => void;
  onImageUpload?: (url: string | null, metadata?: ImageMetadata) => void;
  value?: string; // URL of existing image
  maxSizeMB?: number;
  acceptedFormats?: string[];
  folder?: string;
  disabled?: boolean;
  uploadMethod?: "cloudinary" | "file";
}

export function SingleImageUpload({
  onImageSelect,
  onImageUpload,
  value,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  folder = "uploads",
  disabled = false,
  uploadMethod = "cloudinary",
}: SingleImageUploadProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes (for editing existing images)
  useEffect(() => {
    if (value) {
      setPreview(value);
      setUploadedUrl(value);
    } else {
      setPreview(null);
      setUploadedUrl(null);
    }
  }, [value]);

  const validateFileLocal = (file: File): boolean => {
    setError(null);

    if (!acceptedFormats.includes(file.type)) {
      setError(
        `Please upload a valid image file (${acceptedFormats
          .map((f) => f.split("/")[1])
          .join(", ")})`
      );
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (uploadMethod === "cloudinary") {
      await handleCloudinaryUpload(file);
    } else {
      if (validateFileLocal(file)) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelect?.(file);
      }
    }
  };

  const handleCloudinaryUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file using utility function
      const validation = validateFile(file, {
        maxSize: maxSizeMB * 1024 * 1024,
        acceptedFormats,
      });

      if (!validation.isValid) {
        setError(validation.error || "Invalid file");
        return;
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinaryDirect(file, {
        folder,
        resourceType: "image",
        quality: "auto",
      });

      if (result.success && result.url) {
        setPreview(result.url);
        setUploadedUrl(result.url);
        setImage(file);

        const metadata: ImageMetadata = {
          publicId: result.publicId,
          folder: folder,
          altText: file.name,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.size,
        };

        onImageUpload?.(result.url, metadata);
        onImageSelect?.(file);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = async () => {
    // If we have an uploaded URL, try to delete from Cloudinary
    if (uploadedUrl && uploadedUrl.includes("cloudinary.com")) {
      try {
        // Extract public ID from URL for deletion
        const publicId = uploadedUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.warn("Failed to delete from Cloudinary:", error);
        // Don't show error to user as the image is still removed from UI
      }
    }

    setImage(null);
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelect?.(null);
    onImageUpload?.(null);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              disabled || isUploading
                ? "cursor-not-allowed opacity-50"
                : isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            {isUploading ? (
              <div className="p-3 bg-white rounded-full">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : (
              <div className="p-3 bg-white rounded-full">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              {isUploading ? (
                <p className="text-gray-700">Uploading...</p>
              ) : (
                <p className="text-gray-700">
                  <span className="text-blue-600">Click to upload</span> or drag
                  and drop
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {acceptedFormats
                  .map((f) => f.split("/")[1].toUpperCase())
                  .join(", ")}{" "}
                (max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <div className="relative w-full h-64">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              onClick={handleRemove}
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-sm truncate">{image?.name}</p>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
