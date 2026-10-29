'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Clock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    totalPrice,
    avgPrepTimeMinutes,
    cartDrawerOpen,
    setCartDrawerOpen,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
    clearCart,
    setCheckoutOpen,
  } = useCart();

  if (!cartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-300 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">Your Food Tray</h3>
            <span className="text-xs bg-neutral-800 text-teal-400 px-2 py-0.5 rounded-full">
              {cart.length} items
            </span>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 mb-2 text-neutral-300" />
              <p className="font-semibold text-neutral-700">Your tray is empty</p>
              <p className="text-xs text-neutral-500 mt-1">
                Explore our menu to add delicious campus shakes, burgers, and pizzas!
              </p>
            </div>
          ) : (
            cart.map(({ item, quantity }) => (
              <div
                key={item._id}
                className="bg-white p-3 rounded-lg border border-neutral-200 shadow-xs flex items-center space-x-3"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">{item.name}</h4>
                  <p className="text-xs text-neutral-500">
                    Rs. {item.price} • {item.prepTime}m prep
                  </p>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">
                    Subtotal: Rs. {(item.price * quantity).toFixed(2)}
                  </p>
                </div>
                {/* Quantity Controls matching final_menu.html */}
                <div className="flex items-center space-x-1.5 bg-neutral-100 rounded-md p-1 border border-neutral-200">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded text-neutral-800 hover:bg-neutral-200 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded text-neutral-800 hover:bg-neutral-200 text-xs font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-neutral-200 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-neutral-900">Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Prep Time:</span>
                <span className="font-medium text-neutral-900 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-teal-600" />
                  <span>~{avgPrepTimeMinutes} minutes</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <div>
                <span className="text-xs text-neutral-500 block">Total Due:</span>
                <span className="text-xl font-extrabold text-neutral-900">
                  Rs. {totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setCheckoutOpen(true);
                }}
                className="flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-md"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => clearCart()}
              className="w-full text-center text-xs text-neutral-400 hover:text-red-500 pt-1"
            >
              Clear Tray
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

