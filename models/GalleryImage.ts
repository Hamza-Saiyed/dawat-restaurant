import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage extends Document {
  title?: string;
  category: 'food' | 'interior' | 'events' | 'team';
  imageUrl: string;
  thumbnailUrl?: string;
  publicId: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
  uploadedAt: Date;
}

const GalleryImageSchema: Schema = new Schema({
  title: { type: String, trim: true },
  category: {
    type: String,
    enum: ['food', 'interior', 'events', 'team'],
    default: 'food',
  },
  imageUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  publicId: { type: String, required: true },
  altText: { type: String, trim: true },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
});

// Indexes
GalleryImageSchema.index({ category: 1, sortOrder: 1 });
GalleryImageSchema.index({ isActive: 1 });

export default mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
