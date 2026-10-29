'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IOrder, OrderStatus } from '@/types';
import {
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ArrowLeft,
  ShoppingBag,
  ChefHat,
  BellRing,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success && data.order) {
          setOrder(data.order);
        } else {
          setErrorMsg(data.message || 'Order could not be loaded.');
        }
      } catch {
        setErrorMsg('Network error while retrieving order.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    // Poll every 10 seconds for real-time kitchen updates
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleDownloadPdf = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/orders/${order._id || order.orderNumber}/receipt?format=pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${order.orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        // Fallback to printable HTML in new tab
        window.open(`/api/orders/${order._id || order.orderNumber}/receipt?format=html`, '_blank');
      }
    } catch {
      window.open(`/api/orders/${order._id || order.orderNumber}/receipt?format=html`, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Order Received', icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'preparing', label: 'Cooking & Prep', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', icon: <BellRing className="w-4 h-4" /> },
    { key: 'completed', label: 'Handed Over', icon: <PackageCheck className="w-4 h-4" /> },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready_for_pickup':
      case 'out_for_delivery':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2 text-sm text-neutral-500">
          <Clock className="w-8 h-8 animate-spin mx-auto text-black" />
          <p>Connecting to kitchen dispatch...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-neutral-300 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold">Order Not Found</h2>
          <p className="text-xs text-neutral-500">{errorMsg || 'Please verify the order ID.'}</p>
          <Link
            href="/"
            className="inline-block bg-black text-white font-bold text-xs px-5 py-2.5 rounded-md"
          >
            Return to Campus Dining
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'rejected';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Back Link */}
        <Link
          href="/menu"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        {/* Main Status Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-1">
                <span>ORDER NUMBER</span>
                <span>•</span>
                <span className="font-semibold">{order.restaurantName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black">
                #{order.orderNumber}
              </h1>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex items-center space-x-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Rendering PDF...' : 'Download PDF Receipt'}</span>
              </button>

              <button
                onClick={() =>
                  window.open(`/api/orders/${order._id || order.orderNumber}/receipt?format=html`, '_blank')
                }
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper progress */}
          {!isCancelled ? (
            <div className="py-4">
              <div className="grid grid-cols-5 gap-2 text-center">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={st.key} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-black text-teal-400 ring-4 ring-teal-100 scale-110'
                            : isDone
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {st.icon}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                          isDone ? 'text-black' : 'text-neutral-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Estimated Prep Callout */}
              <div className="mt-8 bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-xs">Estimated Prep Time:</span>
                    <span className="font-extrabold text-black">
                      ~{order.estimatedPrepTimeMinutes} minutes
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-neutral-500 block text-xs">Fulfillment:</span>
                  <span className="font-bold text-neutral-900 capitalize">
                    {order.deliveryType.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-xs text-center font-bold">
              This order was marked as {order.status.toUpperCase()}.
            </div>
          )}

          {/* Itemized summary */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
              Ordered Items
            </h3>
            <div className="divide-y divide-neutral-100 text-xs sm:text-sm">
              {order.items.map((it, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900">{it.quantity}x </span>
                    <span className="text-neutral-800">{it.name}</span>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    Rs. {(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Convenience Tax:</span>
                <span>Rs. {order.tax.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Campus Delivery Fee:</span>
                  <span>Rs. {order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-300 flex justify-between font-extrabold text-sm text-neutral-900">
                <span>Total Paid:</span>
                <span className="text-base text-teal-800">Rs. {order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

