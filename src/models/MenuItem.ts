import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItemDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  prepTime: number; // in minutes
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: mongoose.Types.ObjectId;
  tags: string[];
  isVegetarian: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItemDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    prepTime: {
      type: Number,
      required: true,
      min: 1,
      default: 5,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isVegetarian: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries by restaurant and category
MenuItemSchema.index({ restaurantId: 1, category: 1, isAvailable: 1 });

export const MenuItem: Model<IMenuItemDocument> =
  mongoose.models.MenuItem || mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);

export default MenuItem;

