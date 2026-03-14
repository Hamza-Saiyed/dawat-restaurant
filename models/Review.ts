import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  customerEmail?: string;
  rating: number;
  reviewText: string;
  platform: 'website' | 'google' | 'zomato' | 'swiggy' | 'manual';
  status: 'pending' | 'approved' | 'rejected';
  isSpam: boolean;
  adminNote?: string;
  visitDate?: Date;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  moderatedAt?: Date;
  moderatedBy?: string;
}

const ReviewSchema: Schema = new Schema({
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, trim: true, lowercase: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String, required: true, maxlength: 1000 },
  platform: {
    type: String,
    enum: ['website', 'google', 'zomato', 'swiggy', 'manual'],
    default: 'website',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isSpam: { type: Boolean, default: false },
  adminNote: { type: String },
  visitDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  approvedBy: { type: String },
  moderatedAt: { type: Date },
  moderatedBy: { type: String },
});

// Indexes
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ platform: 1 });
ReviewSchema.index({ rating: 1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
