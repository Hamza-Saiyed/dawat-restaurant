import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  isReplied: boolean;
  repliedAt?: Date;
  adminNote?: string;
  isArchived: boolean;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  isReplied: { type: Boolean, default: false },
  repliedAt: { type: Date },
  adminNote: { type: String },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Indexes
ContactSchema.index({ isRead: 1, createdAt: -1 });
ContactSchema.index({ isArchived: 1, createdAt: -1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
