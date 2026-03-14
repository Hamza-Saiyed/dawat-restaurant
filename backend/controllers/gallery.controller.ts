// Gallery controller — handles gallery CRUD

import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/backend/services/gallery.service';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ApiResponse } from '@/backend/utils/apiResponse';


const service = new GalleryService();

export class GalleryController {
  /** GET /api/admin/gallery — list images */
  async list(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const images = await service.getAllImages(category);
    return ApiResponse.success(images);
  }


  /** POST /api/admin/gallery — upload images (FormData) */
  async upload(req: NextRequest): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const formData = await req.formData();
    const imageFiles = formData.getAll('images') as File[];
    const category = (formData.get('category') as string) || 'food';

    const images = await service.uploadImages(imageFiles, category, admin.email);

    return ApiResponse.created(images, 'Images uploaded successfully');
  }


  /** PATCH /api/admin/gallery/[id] — update image metadata */
  async update(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const data = await req.json();

    const image = await service.updateImage(id, data, admin.email);
    return ApiResponse.success(image, 'Image metadata updated');
  }


  /** DELETE /api/admin/gallery/[id] */
  async delete(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    await service.deleteImage(id, admin.email);
    return ApiResponse.success(null, 'Image deleted');
  }


  /** PUT /api/admin/gallery/reorder */
  async reorder(req: NextRequest): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return ApiResponse.error('Invalid data format', 'INVALID_FORMAT', 400);
    }

    await service.reorderImages(items, admin.email);
    return ApiResponse.success(null, 'Reordered successfully');
  }
}

