import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminEmail: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  adminEmail: { type: String, required: true },
  action: {
    type: String,
    required: true,
    enum: [
      'RESERVATION_APPROVED', 'RESERVATION_REJECTED', 'RESERVATION_COMPLETED', 'RESERVATION_DELETED',
      'MENU_ITEM_CREATED', 'MENU_ITEM_UPDATED', 'MENU_ITEM_DELETED', 'MENU_ITEM_TOGGLED',
      'GALLERY_IMAGE_UPLOADED', 'GALLERY_IMAGE_DELETED', 'GALLERY_REORDERED',
      'REVIEW_APPROVED', 'REVIEW_REJECTED', 'REVIEW_DELETED',
      'MESSAGE_READ', 'MESSAGE_ARCHIVED', 'MESSAGE_DELETED',
      'SETTINGS_UPDATED', 'HERO_UPDATED', 'SOCIAL_LINKS_UPDATED',
      'ADMIN_LOGIN', 'ADMIN_LOGOUT', 'PASSWORD_CHANGED',
    ],
  },
  resourceType: { type: String },
  resourceId: { type: String },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Indexes
ActivityLogSchema.index({ adminId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ resourceType: 1, resourceId: 1 });
// Auto-delete logs older than 90 days
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
