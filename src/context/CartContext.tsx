'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IMenuItem, ICartItem } from '@/types';

interface CartContextType {
  cart: ICartItem[];
  totalPrice: number;
  totalItems: number;
  avgPrepTimeMinutes: number;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addItem: (item: IMenuItem) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaika_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zaika_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  const addItem = (item: IMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item._id === item._id);
      if (existing) {
        return prev.map((ci) =>
          ci.item._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const increaseQuantity = (itemId: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.item._id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci
      )
    );
  };

  const decreaseQuantity = (itemId: string) => {
    setCart((prev) => {
      const target = prev.find((ci) => ci.item._id === itemId);
      if (!target) return prev;
      if (target.quantity <= 1) {
        return prev.filter((ci) => ci.item._id !== itemId);
      }
      return prev.map((ci) =>
        ci.item._id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
      );
    });
  };

  const deleteItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Compute live totals matching legacy formula
  let totalPrice = 0;
  let totalItems = 0;
  let accumulatedTime = 0;

  for (const { item, quantity } of cart) {
    totalPrice += item.price * quantity;
    totalItems += quantity;

    // Legacy formula from final_menu.html:
    // If quantity === 1, baseTime
    // If quantity > 1, baseTime + baseTime * 0.35 * (quantity - 1)
    if (quantity === 1) {
      accumulatedTime += item.prepTime;
    } else if (quantity > 1) {
      accumulatedTime += item.prepTime + item.prepTime * 0.35 * (quantity - 1);
    }
  }

  const avgPrepTimeMinutes = cart.length > 0 ? Math.round(accumulatedTime) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalPrice,
        totalItems,
        avgPrepTimeMinutes,
        checkoutOpen,
        setCheckoutOpen,
        cartDrawerOpen,
        setCartDrawerOpen,
        addItem,
        increaseQuantity,
        decreaseQuantity,
        deleteItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

