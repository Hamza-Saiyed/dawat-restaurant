// Menu controller — handles menu CRUD

import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/backend/services/menu.service';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ApiResponse } from '@/backend/utils/apiResponse';

const service = new MenuService();

const parseNum = (val: FormDataEntryValue | null) => {
  if (val === null || val === '') return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
};


export class MenuController {
  /** GET /api/admin/menu — list menu items (supports category filter) */
  async list(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const items = await service.getAllMenuItems(category);

    return NextResponse.json({ success: true, items });
  }

  /** POST /api/admin/menu — create menu item (FormData) */
  async create(req: NextRequest): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    const itemData = {
      name: formData.get('name') as string,
      nameHindi: formData.get('nameHindi') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      price: parseNum(formData.get('price')) ?? 0,
      discountPrice: parseNum(formData.get('discountPrice')),
      isVeg: formData.get('isVeg') === 'true',
      isSpicy: formData.get('isSpicy') === 'true',
      isPopular: formData.get('isPopular') === 'true',
      isAvailable: formData.get('isAvailable') === 'true',
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(s => s.trim()) : [],
    };

    const item = await service.createMenuItem(itemData, imageFile, admin.email);

    return ApiResponse.created(item, 'Menu item created successfully');
  }


  /** PUT /api/admin/menu/[id] — update menu item (FormData) */
  async update(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const removeImage = formData.get('removeImage') === 'true';

    const updateData = {
      name: formData.get('name') as string,
      nameHindi: formData.get('nameHindi') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      price: parseNum(formData.get('price')) ?? 0,
      discountPrice: parseNum(formData.get('discountPrice')),
      isVeg: formData.get('isVeg') === 'true',
      isSpicy: formData.get('isSpicy') === 'true',
      isPopular: formData.get('isPopular') === 'true',
      isAvailable: formData.get('isAvailable') === 'true',
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(s => s.trim()) : [],
    };

    const item = await service.updateMenuItem(id, updateData, imageFile, removeImage, admin.email);

    return ApiResponse.success(item, 'Menu item updated successfully');
  }


  /** DELETE /api/admin/menu/[id] */
  async delete(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    await service.deleteMenuItem(id, admin.email);
    return ApiResponse.success(null, 'Menu item deleted');
  }
}

