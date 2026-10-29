'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const { cart, totalPrice, avgPrepTimeMinutes, checkoutOpen, setCheckoutOpen, clearCart } =
    useCart();
  const { user, login } = useAuth();

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'campus_delivery'>('pickup');
  const [deliveryLocation, setDeliveryLocation] = useState('Campus Canteen Counter');
  const [instructions, setInstructions] = useState('');
  const [guestStudentId, setGuestStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutOpen) return null;

  const tax = Math.round(totalPrice * 0.05 * 100) / 100;
  const deliveryFee = deliveryType === 'campus_delivery' ? 20 : 0;
  const grandTotal = Math.round((totalPrice + tax + deliveryFee) * 100) / 100;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // If not logged in and no student ID entered
    if (!user && !guestStudentId.trim()) {
      setErrorMsg('Please enter your Student ID to proceed with campus billing.');
      return;
    }

    setSubmitting(true);

    try {
      // If not logged in, auto-login or register guest student ID
      if (!user && guestStudentId.trim()) {
        const loggedIn = await login(guestStudentId.trim(), 'pass123');
        if (!loggedIn) {
          // Attempt registration
          await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: guestStudentId.trim(),
              name: `Student ${guestStudentId.trim()}`,
              email: `${guestStudentId.trim()}@campus.edu`,
              password: 'pass123',
              role: 'customer',
            }),
          });
          await login(guestStudentId.trim(), 'pass123');
        }
      }

      const orderPayload = {
        restaurantId: cart[0]?.item.restaurantId || 'seed-rest-1',
        items: cart.map((ci) => ({
          menuItemId: ci.item._id,
          quantity: ci.quantity,
        })),
        deliveryType,
        deliveryLocation:
          deliveryType === 'campus_delivery' ? deliveryLocation : 'Canteen Pickup Counter',
        specialInstructions: instructions,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        clearCart();
        setCheckoutOpen(false);
        router.push(`/orders/${data.order._id || data.order.orderNumber}`);
      } else {
        setErrorMsg(data.message || 'Failed to place order. Please review your cart.');
      }
    } catch {
      setErrorMsg('Network error while placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <h2 className="font-bold text-base tracking-wide">Confirm & Place Order</h2>
          </div>
          <button
            onClick={() => setCheckoutOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Student ID info */}
            {!user ? (
              <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Student ID for Campus Account Billing
                </label>
                <input
                  type="text"
                  required
                  value={guestStudentId}
                  onChange={(e) => setGuestStudentId(e.target.value)}
                  placeholder="e.g. 12345 or student1"
                  className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Default credentials or new student account will be activated instantly.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs">
                <div>
                  <span className="text-neutral-500 block">Authenticated Student:</span>
                  <span className="font-bold text-neutral-900">{user.name} ({user.studentId})</span>
                </div>
                <div className="flex items-center space-x-1 text-teal-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
            )}

            {/* Delivery mode */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                Fulfillment Mode
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('pickup');
                    setDeliveryLocation('Canteen Pickup Counter');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-black bg-neutral-900 text-white font-semibold'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className="block font-bold">Counter Pickup</span>
                  <span className="text-[10px] text-neutral-400">Collect when ready</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('campus_delivery');
                    setDeliveryLocation('Hostel / Block A Room 204');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    deliveryType === 'campus_delivery'
                      ? 'border-black bg-neutral-900 text-white font-semibold'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className="block font-bold">Campus Delivery</span>
                  <span className="text-[10px] text-neutral-400">+Rs. 20 courier</span>
                </button>
              </div>
            </div>

            {deliveryType === 'campus_delivery' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Delivery Location (Hostel Block / Library Desk / Lab)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Block B, Room 302"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Special Kitchen Instructions (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Less spicy, extra dip, separate bag"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal ({cart.length} unique items):</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Campus Convenience Tax (5%):</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Campus Delivery Fee:</span>
                  <span>Rs. {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Estimated Kitchen Time:</span>
                </span>
                <span className="font-semibold text-neutral-900">~{avgPrepTimeMinutes} minutes</span>
              </div>
              <div className="pt-2 border-t border-neutral-300 flex justify-between font-bold text-sm text-neutral-900">
                <span>Grand Total:</span>
                <span className="text-base text-teal-800">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="w-1/3 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
              >
                Back to Tray
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 flex items-center justify-center space-x-2 bg-black hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md text-xs sm:text-sm transition-colors shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying & Sending Order...</span>
                  </>
                ) : (
                  <span>Place Order (Rs. {grandTotal.toFixed(2)})</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

