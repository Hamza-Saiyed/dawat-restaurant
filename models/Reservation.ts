import mongoose, { Schema, Document } from 'mongoose';
import { generateConfirmationId } from '@/backend/utils/generateId';

export interface IReservation extends Document {
  confirmationId: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: Date;
  time: string;
  occasion?: string;
  specialRequests?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNote?: string;
  ipAddress?: string;
  isExpired: boolean;
  reminderSent: boolean;
  confirmationEmailSent: boolean;
  source: 'website' | 'phone' | 'walkin' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  updatedBy?: string;
  isToday: boolean;
}

const ReservationSchema: Schema = new Schema(
  {
    confirmationId: {
      type: String,
      unique: true,
      required: true,
      default: generateConfirmationId,
    },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number'],
      trim: true,
    },
    email: { type: String, lowercase: true, trim: true, sparse: true },
    guests: { type: Number, required: true, min: 1, max: 20 },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    occasion: {
      type: String,
      enum: ['Birthday', 'Anniversary', 'Business Dinner', 'Family Gathering', 'Date Night', 'Other', null],
    },
    specialRequests: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    adminNote: String,
    ipAddress: String,
    isExpired: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    confirmationEmailSent: { type: Boolean, default: false },
    source: {
      type: String,
      enum: ['website', 'phone', 'walkin', 'admin'],
      default: 'website',
    },
    approvedAt: Date,
    approvedBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// INDEXES
ReservationSchema.index({ date: 1, time: 1 });
ReservationSchema.index({ status: 1, createdAt: -1 });
ReservationSchema.index({ phone: 1, date: 1 });
ReservationSchema.index({ confirmationId: 1 }, { unique: true });
ReservationSchema.index({ createdAt: -1 });
ReservationSchema.index({ status: 1, date: 1 });

// Static: check for duplicate bookings
ReservationSchema.statics.checkDuplicate = async function (
  phone: string,
  date: Date,
  time: string
): Promise<boolean> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const existing = await this.findOne({
    phone,
    date: { $gte: dayStart, $lte: dayEnd },
    time,
    status: { $in: ['pending', 'approved'] },
  });
  return !!existing;
};

// Virtual: isToday
ReservationSchema.virtual('isToday').get(function (this: IReservation) {
  const today = new Date();
  return this.date?.toDateString() === today.toDateString();
});

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>('Reservation', ReservationSchema);
