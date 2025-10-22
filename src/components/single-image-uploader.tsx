"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// ✅ Fixed interface with folder property
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
  value?: string;
  onChange: (url: string | null, metadata?: ImageMetadata) => void;
  folder?: string;
  disabled?: boolean;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  value,
  onChange,
  folder = "uploads",
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error(
        `Invalid file format. Accepted formats: ${acceptedFormats
          .map((f) => f.split("/")[1])
          .join(", ")}`
      );
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(
        `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      if (data.success && data.url) {
        setPreview(data.url);
        onChange(data.url, {
          publicId: data.publicId,
          folder: folder,
          altText: file.name,
          width: data.width,
          height: data.height,
          format: data.format,
          size: file.size,
        });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedFormats.map((f) => f.split("/")[1]).join(", ")} (max{" "}
                {(maxSize / 1024 / 1024).toFixed(0)}MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleImageUpload;
