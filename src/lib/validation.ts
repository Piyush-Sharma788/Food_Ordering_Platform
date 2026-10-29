import { z } from 'zod';

export const registerSchema = z.object({
  studentId: z
    .string()
    .min(3, 'Student ID must be at least 3 characters')
    .max(30, 'Student ID cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Student ID can only contain letters, numbers, hyphens, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  year: z.string().optional(),
  branch: z.string().optional(),
  role: z.enum(['customer', 'canteen_owner']).default('customer'),
});

export const loginSchema = z.object({
  loginId: z.string().min(1, 'Student ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, 'Menu Item ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50, 'Max quantity per item is 50'),
      })
    )
    .min(1, 'Order must contain at least one item'),
  deliveryType: z.enum(['pickup', 'campus_delivery']).default('pickup'),
  deliveryLocation: z.string().optional(),
  specialInstructions: z.string().max(300).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'out_for_delivery',
    'completed',
    'cancelled',
    'rejected',
  ]),
  notes: z.string().max(200).optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters').max(100),
  description: z.string().min(3, 'Description is required').max(500),
  price: z.number().positive('Price must be greater than zero'),
  prepTime: z.number().int().positive('Preparation time must be at least 1 minute'),
  category: z.string().min(2, 'Category is required'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  isAvailable: z.boolean().default(true),
  isVegetarian: z.boolean().default(true),
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
});

export const reviewSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(3, 'Comment must be at least 3 characters').max(500),
});

export const aiChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, 'Message cannot be empty'),
    })
  ),
  preferredProvider: z.enum(['openai', 'gemini', 'auto']).default('auto'),
});

