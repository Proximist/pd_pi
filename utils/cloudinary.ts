// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: Buffer, originalName: string) => {
  try {
    // Generate a short unique identifier
    const hash = crypto
      .createHash('md5')
      .update(`${originalName}${Date.now()}`)
      .digest('hex')
      .substring(0, 8);

    // Convert buffer to base64
    const b64 = Buffer.from(file).toString('base64');
    const dataURI = `data:image/jpeg;base64,${b64}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: hash, // Use short hash as public_id
      folder: 'uploads', // Optional: organize in folder
      resource_type: 'auto'
    });

    // Return only the full public URL
    return { publicUrl: result.secure_url };
  } catch (error) {
    throw new Error(`Error uploading to Cloudinary: ${error}`);
  }
};

export const validateImage = (
  file: { size: number; type: string }
): { valid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
};
