import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger';

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary
 */
export async function uploadImage(fileBuffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload failed', {
            folder,
            error: error.message,
          });
          reject(error);
        } else if (result) {
          logger.info('Cloudinary upload successful', {
            publicId: result.public_id,
            folder,
          });
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary by its public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      logger.warn('Cloudinary delete returned unexpected result', {
        publicId,
        result: result.result,
      });
    } else {
      logger.info('Cloudinary image deleted', { publicId });
    }
  } catch (error) {
    logger.error('Cloudinary delete failed', {
      publicId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Don't throw here to prevent bringing down the whole API endpoint
  }
}

export { cloudinary };
