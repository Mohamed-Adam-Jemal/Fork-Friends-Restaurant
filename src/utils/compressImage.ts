import imageCompression from "browser-image-compression";

/**
 * Compress an image file using browser-image-compression.
 * Returns a new File object that can be used in FormData, etc.
 *
 * @param file - The original image file
 * @returns A Promise that resolves to a compressed File
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Target max size in MB
    maxWidthOrHeight: 1024, // Resize large images
    useWebWorker: true, // Improve performance
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    // Wrap the compressed Blob back into a File object
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    throw error;
  }
}
