// Cloudinary configuration

export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const cloudinaryFolders = {
  menu: 'dawat-restaurant/menu',
  gallery: 'dawat-restaurant/gallery',
  hero: 'dawat-restaurant/hero',
};

export function validateCloudinaryConfig(): void {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not configured properly.');
  }
}
