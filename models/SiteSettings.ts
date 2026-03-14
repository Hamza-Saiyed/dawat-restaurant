import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  restaurantName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  openingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  heroSection: {
    title?: string;
    subtitle?: string;
    backgroundImageUrl?: string;
    backgroundImagePublicId?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  isMaintenanceMode: boolean;
  updatedAt?: Date;
  updatedBy?: string;
}

const defaultHours = { open: '11:00', close: '01:00', isClosed: false };

const SiteSettingsSchema: Schema = new Schema({
  restaurantName: { type: String, default: 'Dawat Restaurant' },
  tagline: { type: String, default: 'Authentic North Indian Taste in Ahmedabad' },
  phone: { type: String, default: '+91 99040 43204' },
  whatsapp: { type: String, default: '919904043204' },
  email: { type: String },
  address: { type: String, default: 'First Floor, Shop No. 2, near HK Travels, opposite Honda Showroom, Vishala Circle, Ahmedabad, Gujarat 380055' },
  openingHours: {
    monday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
    tuesday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
    wednesday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
    thursday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
    friday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
    saturday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
    sunday: { open: { type: String, default: defaultHours.open }, close: { type: String, default: defaultHours.close }, isClosed: { type: Boolean, default: defaultHours.isClosed } },
  },
  socialLinks: {
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    youtube: { type: String },
  },
  heroSection: {
    title: { type: String },
    subtitle: { type: String },
    backgroundImageUrl: { type: String },
    backgroundImagePublicId: { type: String },
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
  },
  isMaintenanceMode: { type: Boolean, default: false },
  updatedAt: { type: Date },
  updatedBy: { type: String }
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
