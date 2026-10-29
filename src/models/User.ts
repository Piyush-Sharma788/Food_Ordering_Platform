import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from '@/types';

export interface IUserDocument extends Document {
  studentId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  year?: string;
  branch?: string;
  avatar?: string;
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'canteen_owner', 'admin'],
      default: 'customer',
      index: true,
    },
    year: {
      type: String,
      default: '1st Year',
    },
    branch: {
      type: String,
      default: 'Computer Science',
    },
    avatar: {
      type: String,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;

