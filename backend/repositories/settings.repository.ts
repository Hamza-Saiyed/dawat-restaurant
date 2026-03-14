// Settings repository — database query layer

import connectDB from '@/lib/mongodb';
import SiteSettings, { ISiteSettings } from '@/models/SiteSettings';

export class SettingsRepository {
  static async get(): Promise<ISiteSettings> {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      settings = await SiteSettings.create({});
      settings = settings.toObject();
    }

    return settings as ISiteSettings;
  }

  static async update(data: Partial<ISiteSettings>, adminEmail?: string): Promise<ISiteSettings> {
    await connectDB();
    const updateData = {
      ...data,
      updatedAt: new Date(),
      ...(adminEmail ? { updatedBy: adminEmail } : {}),
    };

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    return settings as ISiteSettings;
  }
}
