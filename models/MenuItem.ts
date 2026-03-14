import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  nameHindi?: string;
  category: 'starters' | 'main-course' | 'biryani' | 'tandoor' | 'desserts' | 'beverages';
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;
  imagePublicId?: string;
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  sortOrder: number;
  allergens: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameHindi: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['starters', 'main-course', 'biryani', 'tandoor', 'desserts', 'beverages'],
    },
    description: { type: String, required: true, maxlength: 200 },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    image: { type: String },
    imagePublicId: { type: String },
    isVeg: { type: Boolean, default: true },
    isSpicy: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    allergens: [{ type: String }],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Indexes
MenuItemSchema.index({ category: 1, sortOrder: 1 });
MenuItemSchema.index({ isAvailable: 1 });
MenuItemSchema.index({ isPopular: 1 });

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
