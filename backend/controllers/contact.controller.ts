// Contact controller — handles contact form and messages

import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/backend/services/contact.service';
import { validateBody } from '@/backend/middlewares/validate.middleware';
import { createRateLimit } from '@/backend/middlewares/rateLimit.middleware';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ContactCreateSchema } from '@/backend/validators/contact.validator';
import { ApiResponse } from '@/backend/utils/apiResponse';


const service = new ContactService();

export class ContactController {
  /** POST /api/contact — public contact form submission */
  async create(req: NextRequest): Promise<NextResponse> {
    // Rate limit
    const rateLimitResult = await createRateLimit('contact-form')(req);
    if (rateLimitResult) return rateLimitResult;

    // Validate
    const data = await validateBody(req, ContactCreateSchema);

    // Create
    await service.createContact(data);

    return ApiResponse.created(null, 'Message successfully sent');
  }


  /** GET /api/admin/messages — admin list messages */
  async list(req: NextRequest): Promise<NextResponse> {
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || undefined;
    const search = searchParams.get('search') || undefined;

    const messages = await service.getMessages(filter, search);
    return ApiResponse.success(messages);
  }


  /** GET /api/admin/messages/[id] */
  async getById(req: NextRequest, id: string): Promise<NextResponse> {
    await requireAuth(req);
    const message = await service.getById(id);
    return ApiResponse.success(message);
  }


  /** PATCH /api/admin/messages/[id] */
  async update(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const data = await req.json();
    const message = await service.updateMessage(id, data, admin.email);
    return ApiResponse.success(message, 'Message updated successfully');
  }


  /** DELETE /api/admin/messages/[id] */
  async delete(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    await service.deleteMessage(id, admin.email);
    return ApiResponse.success(null, 'Message deleted');
  }
}

