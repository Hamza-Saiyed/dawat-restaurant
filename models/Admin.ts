import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'staff';
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  isLocked: boolean;
}

const AdminSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['super_admin', 'admin', 'staff'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Indexes
AdminSchema.index({ email: 1 }, { unique: true });

// Hash password before save
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password as string, 12);
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Account lockout virtual
AdminSchema.virtual('isLocked').get(function (this: IAdmin) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Ensure virtuals are serialized
AdminSchema.set('toJSON', { virtuals: true });
AdminSchema.set('toObject', { virtuals: true });

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
