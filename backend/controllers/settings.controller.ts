// Settings controller — handles site settings

import { NextRequest, NextResponse } from 'next/server';
import { SettingsService } from '@/backend/services/settings.service';
import { requireAuth } from '@/backend/middlewares/auth.middleware';

const service = new SettingsService();

export class SettingsController {
  /** GET /api/admin/settings */
  async get(): Promise<NextResponse> {
    const settings = await service.getSettings();
    return NextResponse.json({ success: true, settings });
  }

  /** PUT /api/admin/settings */
  async update(req: NextRequest): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const data = await req.json();

    const settings = await service.updateSettings(data, admin.email);
    return NextResponse.json({ success: true, settings });
  }
}
