import mongoose, { Schema, Document, Model } from 'mongoose';
import { EateryCategory } from '@/types';

export interface IRestaurantDocument extends Document {
  name: string;
  slug: string;
  description: string;
  category: EateryCategory;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  location: string;
  openingHours: string;
  isActive: boolean;
  ownerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Canteen', 'Cafe', 'Dhaba', 'Fast Food'],
      default: 'Canteen',
      index: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Campus Ground Floor / Food Court',
    },
    openingHours: {
      type: String,
      default: '08:00 AM - 10:00 PM',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Restaurant: Model<IRestaurantDocument> =
  mongoose.models.Restaurant || mongoose.model<IRestaurantDocument>('Restaurant', RestaurantSchema);

export default Restaurant;

