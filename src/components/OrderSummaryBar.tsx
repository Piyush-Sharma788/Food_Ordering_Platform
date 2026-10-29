'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Clock, ShoppingCart, ArrowRight } from 'lucide-react';

export const OrderSummaryBar: React.FC = () => {
  const { totalPrice, avgPrepTimeMinutes, totalItems, setCheckoutOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-black text-white px-4 py-3 sm:py-3.5 shadow-2xl border-t border-neutral-800 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Statistics breakdown matching final_menu.html */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-x-6 gap-y-1 text-xs sm:text-sm">
          <div className="flex items-center space-x-1.5 font-bold text-base sm:text-lg">
            <span className="text-neutral-400 text-xs font-normal">Total Price:</span>
            <span className="text-white">Rs. {totalPrice.toFixed(2)}</span>
          </div>

          <div className="hidden sm:inline text-neutral-600">|</div>

          <div className="flex items-center space-x-1.5 text-neutral-300">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className="text-neutral-400">Avg Prep Time:</span>
            <span className="font-semibold text-white">~{avgPrepTimeMinutes} mins</span>
          </div>

          <div className="hidden sm:inline text-neutral-600">|</div>

          <div className="flex items-center space-x-1.5 text-neutral-300">
            <ShoppingCart className="w-4 h-4 text-teal-400" />
            <span className="text-neutral-400">Total Items:</span>
            <span className="font-semibold text-white">{totalItems}</span>
          </div>
        </div>

        {/* Pay Now Button matching final_menu.html */}
        <button
          onClick={() => setCheckoutOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-neutral-200 text-black font-extrabold px-6 py-2.5 rounded-md text-sm transition-all shadow-md hover:shadow-lg active:scale-98"
        >
          <span>Pay Now / Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryBar;

