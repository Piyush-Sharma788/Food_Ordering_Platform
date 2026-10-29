export type UserRole = 'customer' | 'canteen_owner' | 'admin';

export interface IUser {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  role: UserRole;
  year?: string;
  branch?: string;
  avatar?: string;
  orderCount?: number;
  createdAt?: string;
}

export type EateryCategory = 'Canteen' | 'Cafe' | 'Dhaba' | 'Fast Food';

export interface IRestaurant {
  _id: string;
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
  ownerId?: string;
}

export interface IMenuItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  prepTime: number; // in minutes
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: string;
  restaurantName?: string;
  tags?: string[];
  isVegetarian: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface IOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  prepTime: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  studentId: string;
  restaurantId: string;
  restaurantName: string;
  items: IOrderItem[];
  totalPrice: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  estimatedPrepTimeMinutes: number;
  status: OrderStatus;
  deliveryType: 'pickup' | 'campus_delivery';
  deliveryLocation?: string;
  specialInstructions?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash_at_counter' | 'online_simulated';
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  item: IMenuItem;
  quantity: number;
}

export interface IReview {
  _id: string;
  userId: string;
  studentId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
