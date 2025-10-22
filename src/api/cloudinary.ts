// api/cloudinary.ts
interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  [key: string]: any;
}

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
  apiSecret?: string;
}

// Get config from environment variables
const getCloudinaryConfig = (): CloudinaryConfig => ({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  file: File,
  folder?: string,
  resourceType: "image" | "video" | "raw" | "auto" = "auto"
): Promise<CloudinaryUploadResponse> => {
  const config = getCloudinaryConfig();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", config.uploadPreset);

  if (folder) {
    formData.append("folder", folder);
  }

  formData.append("resource_type", resourceType);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // This should be done through your backend API for security
  // as it requires API secret which shouldn't be exposed to client
  const response = await fetch("/api/cloudinary/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.statusText}`);
  }
};

// Helper to extract public_id from Cloudinary URL
export const extractPublicId = (url: string): string => {
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return "";

  // Get everything after version number (v1234567890)
  const publicIdParts = parts.slice(uploadIndex + 2);
  // Remove file extension
  const lastPart = publicIdParts[publicIdParts.length - 1];
  const nameWithoutExt = lastPart.substring(0, lastPart.lastIndexOf("."));
  publicIdParts[publicIdParts.length - 1] = nameWithoutExt;

  return publicIdParts.join("/");
};
