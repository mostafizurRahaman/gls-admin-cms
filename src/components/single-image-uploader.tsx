// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
// import axios from "axios";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { Typography } from "./typography";
// import { cn } from "@/lib/utils";
// import {
//   Loader2,
//   Upload,
//   Image as ImageIcon,
//   CheckCircle2,
//   AlertCircle,
//   Trash2,
//   Eye,
//   Download,
//   RefreshCw,
//   Camera,
// } from "lucide-react";

// interface UploadedImage {
//   url: string;
//   publicId: string;
//   size?: number;
//   name?: string;
//   uploadedAt?: Date;
// }

// interface SingleImageUploadProps {
//   cloudName: string;
//   uploadPreset: string;
//   initialImage?: string;
//   initialPublicId?: string;
//   maxSize?: number;
//   onUpdate?: (url: string, publicId: string) => void;
//   onRemove?: (publicId: string, url: string) => void;
//   className?: string;
//   folder?: string;
//   acceptedFormats?: string[];
//   label?: string;
//   required?: boolean;
//   disabled?: boolean;
//   shape?: "square" | "circle" | "rounded";
//   placeholder?: string;
// }

// // Custom hook for file upload logic
// const useImageUpload = (
//   cloudName: string,
//   uploadPreset: string,
//   folder: string
// ) => {
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState<string | null>(null);

//   const uploadToCloudinary = async (
//     file: File
//   ): Promise<UploadedImage | null> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);
//     if (folder) formData.append("folder", folder);
//     formData.append("tags", "single-image-upload");

//     try {
//       setError(null);
//       setUploadProgress(10);

//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         formData,
//         {
//           timeout: 30000,
//           onUploadProgress: (progressEvent) => {
//             const progress = progressEvent.total
//               ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
//               : 0;
//             setUploadProgress(progress);
//           },
//         }
//       );

//       return {
//         url: response.data.secure_url,
//         publicId: response.data.public_id,
//         size: file.size,
//         name: file.name,
//         uploadedAt: new Date(),
//       };
//     } catch (error) {
//       setError("Failed to upload image. Please try again.");
//       throw error;
//     }
//   };

//   return {
//     uploading,
//     setUploading,
//     uploadProgress,
//     setUploadProgress,
//     error,
//     setError,
//     uploadToCloudinary,
//   };
// };

// // Custom hook for drag and drop
// const useDragAndDrop = () => {
//   const [dragActive, setDragActive] = useState(false);
//   const dragCounter = useRef(0);

//   const handleDrag = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   }, []);

//   const handleDragIn = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dragCounter.current++;
//     if (e.dataTransfer.items?.length > 0) setDragActive(true);
//   }, []);

//   const handleDragOut = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dragCounter.current--;
//     if (dragCounter.current === 0) setDragActive(false);
//   }, []);

//   const handleDrop = useCallback(
//     (e: React.DragEvent, callback: (file: File) => void) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setDragActive(false);
//       dragCounter.current = 0;
//       if (e.dataTransfer.files?.[0]) callback(e.dataTransfer.files[0]);
//     },
//     []
//   );

//   return { dragActive, handleDrag, handleDragIn, handleDragOut, handleDrop };
// };

// // Utility functions
// const extractPublicIdFromUrl = (url: string): string => {
//   try {
//     const matches = url.match(/\/([^\/]+)\/([^\/.]+)(?:\.[^\/]+)?$/);
//     return matches ? matches[2] : "";
//   } catch {
//     return "";
//   }
// };

// const formatFileSize = (bytes: number): string => {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
// };

// const validateFile = (
//   file: File,
//   maxSize: number,
//   acceptedFormats: string[]
// ): string | null => {
//   if (!file.type.startsWith("image/")) return "Please select an image file";
//   if (file.size > maxSize * 1024 * 1024)
//     return `File size must be less than ${maxSize}MB`;

//   const extension = file.name.split(".").pop()?.toUpperCase();
//   if (extension && !acceptedFormats.includes(extension)) {
//     return `File format not supported. Accepted: ${acceptedFormats.join(", ")}`;
//   }
//   return null;
// };

// const getShapeClasses = (shape: string) => {
//   switch (shape) {
//     case "circle":
//       return "rounded-full";
//     case "square":
//       return "rounded-none";
//     default:
//       return "rounded-xl";
//   }
// };

// export default function SingleImageUpload({
//   cloudName,
//   uploadPreset,
//   initialImage = "",
//   initialPublicId = "",
//   maxSize = 5,
//   onUpdate,
//   onRemove,
//   className,
//   folder = "",
//   acceptedFormats = ["PNG", "JPG", "JPEG", "GIF", "WEBP"],
//   label = "Profile Image",
//   required = false,
//   disabled = false,
//   shape = "rounded",
//   placeholder = "/image-placeholder.png",
// }: SingleImageUploadProps) {
//   const [image, setImage] = useState<UploadedImage | null>(null);
//   const [previewMode, setPreviewMode] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const {
//     uploading,
//     setUploading,
//     uploadProgress,
//     setUploadProgress,
//     error,
//     setError,
//     uploadToCloudinary,
//   } = useImageUpload(cloudName, uploadPreset, folder);
//   const { dragActive, handleDrag, handleDragIn, handleDragOut, handleDrop } =
//     useDragAndDrop();

//   useEffect(() => {
//     if (initialImage) {
//       setImage({
//         url: initialImage,
//         publicId: initialPublicId || extractPublicIdFromUrl(initialImage),
//         name: "Current Image",
//         uploadedAt: new Date(),
//       });
//     }
//   }, [initialImage, initialPublicId]);

//   const processFile = async (file: File) => {
//     const validationError = validateFile(file, maxSize, acceptedFormats);
//     if (validationError) {
//       setError(validationError);
//       toast.error(validationError);
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     try {
//       const uploadedImage = await uploadToCloudinary(file);
//       if (uploadedImage) {
//         setImage(uploadedImage);
//         setUploadProgress(100);
//         onUpdate?.(uploadedImage.url, uploadedImage.publicId);
//         toast.success("Image uploaded successfully");
//         setTimeout(() => setUploadProgress(0), 1000);
//       }
//     } catch (error) {
//       toast.error("Upload failed");
//       setUploadProgress(0);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) await processFile(file);
//     e.target.value = "";
//   };

//   const handleRemove = () => {
//     if (image) {
//       onRemove?.(image.publicId, image.url);
//       setImage(null);
//       setError(null);
//       toast.success("Image removed");
//     }
//   };

//   return (
//     <div className={cn("w-full max-w-md mx-auto", className)}>
//       {label && (
//         <div className="mb-3 flex items-center justify-between">
//           <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//             {label}
//             {required && <span className="text-red-500">*</span>}
//           </label>
//           {image && (
//             <span className="text-xs text-gray-500">
//               {formatFileSize(image.size || 0)}
//             </span>
//           )}
//         </div>
//       )}

//       <div
//         className={cn(
//           "relative group bg-gradient-to-br from-gray-50 via-white to-gray-50",
//           "border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300",
//           getShapeClasses(shape),
//           dragActive && "border-primary bg-primary/5 scale-[1.02]",
//           error && "border-red-300 bg-red-50",
//           disabled && "opacity-60 pointer-events-none"
//         )}
//         onDragEnter={handleDragIn}
//         onDragLeave={handleDragOut}
//         onDragOver={handleDrag}
//         onDrop={(e) => handleDrop(e, processFile)}
//       >
//         {!image ? (
//           <UploadArea
//             uploading={uploading}
//             uploadProgress={uploadProgress}
//             dragActive={dragActive}
//             error={error}
//             fileInputRef={fileInputRef}
//             disabled={disabled}
//             acceptedFormats={acceptedFormats}
//             maxSize={maxSize}
//             shape={shape}
//           />
//         ) : (
//           <ImagePreview
//             image={image}
//             uploading={uploading}
//             uploadProgress={uploadProgress}
//             shape={shape}
//             placeholder={placeholder}
//             onPreview={() => setPreviewMode(true)}
//             onReplace={() => fileInputRef.current?.click()}
//             onRemove={handleRemove}
//           />
//         )}

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileChange}
//           disabled={uploading || disabled}
//         />
//       </div>

//       {!error && (
//         <p className="mt-2 text-xs text-gray-500 text-center">
//           {image
//             ? "Click on image to view actions"
//             : `Supported: ${acceptedFormats.join(", ")} up to ${maxSize}MB`}
//         </p>
//       )}

//       {uploading && (
//         <div className="mt-3">
//           <Progress value={uploadProgress} className="h-1" />
//         </div>
//       )}

//       {previewMode && image && (
//         <PreviewModal
//           image={image}
//           onClose={() => setPreviewMode(false)}
//           onReplace={() => {
//             fileInputRef.current?.click();
//             setPreviewMode(false);
//           }}
//           onRemove={() => {
//             handleRemove();
//             setPreviewMode(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // Extracted components
// const UploadArea = ({
//   uploading,
//   uploadProgress,
//   dragActive,
//   error,
//   fileInputRef,
//   disabled,
//   acceptedFormats,
//   maxSize,
//   shape,
// }) => (
//   <div className="p-8 text-center">
//     <div
//       className={cn(
//         "mx-auto w-32 h-32 mb-4 bg-gradient-to-br from-gray-100 to-gray-50",
//         "border-2 border-dashed border-gray-300 flex items-center justify-center",
//         getShapeClasses(shape),
//         "group-hover:border-primary group-hover:bg-primary/5 transition-all"
//       )}
//     >
//       {uploading ? (
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
//           <span className="text-xs text-gray-600">{uploadProgress}%</span>
//         </div>
//       ) : (
//         <Camera className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
//       )}
//     </div>

//     <Typography variant="Medium_H6" className="text-gray-700 mb-1">
//       {dragActive ? "Drop image here" : "Upload Image"}
//     </Typography>
//     <p className="text-sm text-gray-500 mb-4">Drag & drop or click to browse</p>

//     <button
//       type="button"
//       onClick={() => fileInputRef.current?.click()}
//       disabled={uploading || disabled}
//       className={cn(
//         "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
//         "bg-primary text-white hover:bg-primary/90",
//         "font-medium text-sm transition-all hover:shadow-md active:scale-95",
//         "disabled:opacity-50 disabled:cursor-not-allowed"
//       )}
//     >
//       <Upload className="h-4 w-4" />
//       Choose File
//     </button>

//     <div className="mt-4 space-y-1">
//       <p className="text-xs text-gray-400">
//         {acceptedFormats.join(", ")} • Max {maxSize}MB
//       </p>
//     </div>

//     {error && (
//       <div className="mt-4 p-2 bg-red-100 border border-red-200 rounded-lg">
//         <p className="text-xs text-red-600 flex items-center gap-1">
//           <AlertCircle className="h-3 w-3" />
//           {error}
//         </p>
//       </div>
//     )}
//   </div>
// );

// const ImagePreview = ({
//   image,
//   uploading,
//   uploadProgress,
//   shape,
//   placeholder,
//   onPreview,
//   onReplace,
//   onRemove,
// }) => (
//   <div className="relative overflow-hidden">
//     <div
//       className={cn(
//         "relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50"
//       )}
//     >
//       <img
//         src={image.url}
//         alt={image.name || "Uploaded image"}
//         className={cn("w-full h-full object-cover", getShapeClasses(shape))}
//         onError={(e) => {
//           (e.target as HTMLImageElement).src = placeholder;
//         }}
//       />

//       {uploading && <UploadOverlay uploadProgress={uploadProgress} />}
//       {!uploading && <SuccessBadge />}

//       <div
//         className={cn(
//           "absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent",
//           "opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4"
//         )}
//       >
//         <ActionButtons
//           onPreview={onPreview}
//           onReplace={onReplace}
//           onRemove={onRemove}
//           imageUrl={image.url}
//         />
//         <ImageInfo image={image} />
//       </div>
//     </div>

//     <InfoBar image={image} onReplace={onReplace} />
//   </div>
// );

// const UploadOverlay = ({ uploadProgress }) => (
//   <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//     <div className="text-center">
//       <div className="relative w-20 h-20 mx-auto mb-3">
//         <svg className="w-20 h-20 transform -rotate-90">
//           <circle
//             cx="40"
//             cy="40"
//             r="36"
//             stroke="rgba(255,255,255,0.2)"
//             strokeWidth="8"
//             fill="none"
//           />
//           <circle
//             cx="40"
//             cy="40"
//             r="36"
//             stroke="white"
//             strokeWidth="8"
//             fill="none"
//             strokeDasharray={`${2 * Math.PI * 36}`}
//             strokeDashoffset={`${
//               2 * Math.PI * 36 * (1 - uploadProgress / 100)
//             }`}
//             className="transition-all duration-300"
//           />
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-white font-medium">
//           {uploadProgress}%
//         </span>
//       </div>
//       <p className="text-white text-sm">Uploading...</p>
//     </div>
//   </div>
// );

// const SuccessBadge = () => (
//   <div className="absolute top-3 right-3">
//     <div className="p-2 bg-green-500 rounded-full shadow-lg">
//       <CheckCircle2 className="h-4 w-4 text-white" />
//     </div>
//   </div>
// );

// const ActionButtons = ({ onPreview, onReplace, onRemove, imageUrl }) => (
//   <div className="flex items-center justify-center gap-2 mb-2">
//     <button
//       onClick={onPreview}
//       className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
//       title="Preview"
//     >
//       <Eye className="h-5 w-5 text-white" />
//     </button>
//     <button
//       onClick={onReplace}
//       className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
//       title="Replace"
//     >
//       <RefreshCw className="h-5 w-5 text-white" />
//     </button>
//     <a
//       href={imageUrl}
//       download
//       className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
//       title="Download"
//     >
//       <Download className="h-5 w-5 text-white" />
//     </a>
//     <button
//       onClick={onRemove}
//       className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-red-500/80 transition-all"
//       title="Remove"
//     >
//       <Trash2 className="h-5 w-5 text-white" />
//     </button>
//   </div>
// );

// const ImageInfo = ({ image }) => (
//   <div className="text-center">
//     <p className="text-white text-sm font-medium truncate">{image.name}</p>
//     <p className="text-white/80 text-xs">
//       {image.uploadedAt && new Date(image.uploadedAt).toLocaleDateString()}
//     </p>
//   </div>
// );

// const InfoBar = ({ image, onReplace }) => (
//   <div className="bg-white border-t border-gray-100 px-4 py-3">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <ImageIcon className="h-4 w-4 text-gray-400" />
//         <span className="text-sm text-gray-600 truncate max-w-[150px]">
//           {image.name || "Image"}
//         </span>
//       </div>
//       <div className="flex items-center gap-3">
//         <span className="text-xs text-gray-500">
//           {formatFileSize(image.size || 0)}
//         </span>
//         <button
//           onClick={onReplace}
//           className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
//         >
//           Change
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const PreviewModal = ({ image, onClose, onReplace, onRemove }) => (
//   <div
//     className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
//     onClick={onClose}
//   >
//     <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
//       <img
//         src={image.url}
//         alt="Preview"
//         className="w-full h-full object-contain max-h-[80vh]"
//       />

//       <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
//         <div className="text-white">
//           <p className="font-medium">{image.name}</p>
//           <p className="text-sm opacity-80">
//             {formatFileSize(image.size || 0)}
//           </p>
//         </div>
//       </div>

//       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
//         <div className="flex items-center justify-center gap-3">
//           <a
//             href={image.url}
//             download
//             onClick={(e) => e.stopPropagation()}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-white text-sm"
//           >
//             <Download className="h-4 w-4" />
//             Download
//           </a>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onReplace();
//             }}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-white text-sm"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Replace
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onRemove();
//             }}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors text-white text-sm"
//           >
//             <Trash2 className="h-4 w-4" />
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// components/cloudinary-single-image-upload.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, File, Play, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "@/api/cloudinary";

interface SingleImageUploadProps {
  value?: string;
  onChange?: (url: string | undefined) => void;
  className?: string;
  name?: string;
  accept?: string;
  folder?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface UploadedFile {
  url: string;
  publicId: string;
  progress: number;
  fileType: string;
  isUploading: boolean;
  isDeleting: boolean;
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  value,
  onChange,
  className,
  name,
  accept = "image/*,video/*",
  folder = "uploads",
  disabled = false,
  placeholder = "Upload file",
}) => {
  const [file, setFile] = useState<UploadedFile | null>(() => {
    if (!value) return null;

    const isVideo =
      value.includes(".mp4") ||
      value.includes(".webm") ||
      value.includes(".mov");
    const extension = value.split(".").pop()?.toLowerCase() || "";

    let fileType = "application/octet-stream";
    if (isVideo) {
      fileType = `video/${extension}`;
    } else {
      fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
    }

    return {
      url: value,
      publicId: extractPublicId(value),
      progress: 100,
      fileType,
      isUploading: false,
      isDeleting: false,
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef<string | undefined>(value);

  // Sync with parent value
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!value) {
        setFile(null);
      } else if (!file || file.url !== value) {
        const isVideo = value.includes(".mp4") || value.includes(".webm");
        const extension = value.split(".").pop()?.toLowerCase() || "";

        let fileType = "application/octet-stream";
        if (isVideo) {
          fileType = `video/${extension}`;
        } else {
          fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
        }

        setFile({
          url: value,
          publicId: extractPublicId(value),
          progress: 100,
          fileType,
          isUploading: false,
          isDeleting: false,
        });
      }
      prevValueRef.current = value;
    }
  }, [value, file]);

  const handleUpload = useCallback(
    async (uploadFile: File) => {
      if (disabled) return;

      const tempUrl = URL.createObjectURL(uploadFile);
      const tempFile: UploadedFile = {
        url: tempUrl,
        publicId: "",
        progress: 0,
        fileType: uploadFile.type,
        isUploading: true,
        isDeleting: false,
      };

      setFile(tempFile);

      try {
        const resourceType = uploadFile.type.startsWith("video/")
          ? "video"
          : "image";
        const result = await uploadToCloudinary(
          uploadFile,
          folder,
          resourceType
        );

        URL.revokeObjectURL(tempUrl);

        const newFile: UploadedFile = {
          url: result.secure_url,
          publicId: result.public_id,
          progress: 100,
          fileType: uploadFile.type,
          isUploading: false,
          isDeleting: false,
        };

        setFile(newFile);
        onChange?.(result.secure_url);
      } catch (error) {
        console.error("Upload failed:", error);
        URL.revokeObjectURL(tempUrl);
        setFile(null);
        onChange?.(undefined);
      }
    },
    [folder, onChange, disabled]
  );

  const handleDelete = useCallback(async () => {
    if (!file || disabled) return;

    setFile((prev) => (prev ? { ...prev, isDeleting: true } : null));

    try {
      if (file.publicId) {
        await deleteFromCloudinary(file.publicId);
      }
      setFile(null);
      onChange?.(undefined);
    } catch (error) {
      console.error("Delete failed:", error);
      setFile((prev) => (prev ? { ...prev, isDeleting: false } : null));
    }
  }, [file, onChange, disabled]);

  const isImage = file?.fileType.startsWith("image/");
  const isVideo = file?.fileType.startsWith("video/");

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="relative">
        {!file ? (
          <Button
            variant="outline"
            className="h-24 w-24 sm:h-32 sm:w-32"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            type="button"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-xs">{placeholder}</span>
            </div>
          </Button>
        ) : (
          <div
            className={cn(
              "relative w-24 h-24 sm:w-32 sm:h-32 rounded-md transition-all duration-300",
              file.isDeleting && "opacity-50 scale-95"
            )}
          >
            {isImage ? (
              <img
                src={file.url}
                alt="Uploaded file"
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
            ) : isVideo ? (
              <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-100">
                <video
                  src={file.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <Play className="h-8 w-8 text-white/90 fill-white/90" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                <File className="h-10 w-10 text-gray-500" />
              </div>
            )}

            {file.isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}

            {!file.isUploading && !file.isDeleting && (
              <button
                onClick={handleDelete}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                aria-label="Remove file"
                type="button"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          name={name}
          onChange={(e) => {
            const uploadFile = e.target.files?.[0];
            if (uploadFile) {
              handleUpload(uploadFile);
            }
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SingleImageUpload;
