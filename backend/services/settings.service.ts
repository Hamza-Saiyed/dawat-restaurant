// Settings service — business logic layer

import { SettingsRepository } from '@/backend/repositories/settings.repository';
import { CacheService } from './cache.service';
import { ActivityLogService } from './activityLog.service';
import { CACHE_TTL } from '@/backend/config/constants';
import { ISiteSettings } from '@/models/SiteSettings';

const CACHE_KEY = 'settings:site';

export class SettingsService {
  async getSettings(): Promise<ISiteSettings> {
    const cached = await CacheService.get<ISiteSettings>(CACHE_KEY);
    if (cached) return cached;

    const settings = await SettingsRepository.get();
    await CacheService.set(CACHE_KEY, settings, CACHE_TTL.SETTINGS);
    return settings;
  }

  async updateSettings(
    data: Partial<ISiteSettings>,
    adminEmail: string
  ): Promise<ISiteSettings> {
    const settings = await SettingsRepository.update(data, adminEmail);

    // Invalidate cache
    await CacheService.delete(CACHE_KEY);

    // Log activity
    ActivityLogService.log({
      adminEmail,
      action: 'SETTINGS_UPDATED',
      resourceType: 'settings',
      details: { updatedFields: Object.keys(data) },
    }).catch(() => {});

    return settings;
  }
}
