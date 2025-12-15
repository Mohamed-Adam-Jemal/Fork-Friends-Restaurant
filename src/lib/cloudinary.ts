// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

// Cloudinary will automatically parse CLOUDINARY_URL from .env
cloudinary.config({ secure: true });

export default cloudinary;
