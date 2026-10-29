import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderStatus } from '@/types';

export interface IOrderItemSubdocument {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  prepTime: number;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  studentId: string;
  restaurantId: mongoose.Types.ObjectId;
  restaurantName: string;
  items: IOrderItemSubdocument[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalPrice: number;
  estimatedPrepTimeMinutes: number;
  status: OrderStatus;
  deliveryType: 'pickup' | 'campus_delivery';
  deliveryLocation?: string;
  specialInstructions?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash_at_counter' | 'online_simulated';
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemSubdocument>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    prepTime: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    restaurantName: {
      type: String,
      required: true,
      default: 'Campus Canteen',
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: unknown[]) => val.length > 0, 'Order must contain at least 1 item'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedPrepTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'completed',
        'cancelled',
        'rejected',
      ],
      default: 'pending',
      index: true,
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'campus_delivery'],
      default: 'pickup',
    },
    deliveryLocation: {
      type: String,
      default: 'Campus Canteen Counter',
    },
    specialInstructions: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash_at_counter', 'online_simulated'],
      default: 'cash_at_counter',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ restaurantId: 1, status: 1, createdAt: -1 });

export const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
