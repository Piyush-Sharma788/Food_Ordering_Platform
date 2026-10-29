'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IMenuItem, IOrder, OrderStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  Utensils,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Store,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function CanteenManagementPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [loading, setLoading] = useState(true);

  // New item form state matching canteen.html
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Snacks');
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch menu and live orders
  const loadData = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        fetch('/api/menu-items?all=true'),
        fetch('/api/orders'),
      ]);

      const menuData = await menuRes.json();
      if (menuData.success && menuData.items) {
        setMenuItems(menuData.items);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.orders) {
          setOrders(ordersData.orders);
        }
      }
    } catch (err) {
      console.error('Failed to load canteen data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle adding new item matching canteen.html
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          prepTime: Number(prepTime),
          imageUrl,
          category,
          restaurantId: menuItems[0]?.restaurantId || 'seed-rest-1',
          isVegetarian: true,
          isAvailable: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.item) {
        setMenuItems((prev) => [data.item, ...prev]);
        setFormMsg({ type: 'success', text: `Item "${name}" successfully added to menu!` });
        setName('');
        setDescription('');
        setPrice('');
        setPrepTime('');
        setImageUrl('');
      } else {
        setFormMsg({
          type: 'error',
          text: data.message || 'Failed to add item. Ensure you are signed in as canteen staff.',
        });
      }
    } catch {
      setFormMsg({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting item matching canteen.html
  const handleDeleteItem = async (id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to remove "${itemName}" from the canteen menu?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMenuItems((prev) => prev.filter((it) => it._id !== id));
      } else {
        alert(data.message || 'Could not delete item. Staff privileges required.');
      }
    } catch {
      alert('Network error while deleting item.');
    }
  };

  // Handle Order status updates
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
        );
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch {
      alert('Error updating order status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-neutral-900 pb-16">
      {/* Top Banner */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 border-b border-neutral-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Store className="w-4 h-4" />
              <span>Canteen Owner & Kitchen Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Campus Canteen Operations
            </h1>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-md transition-all ${
                activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Live Orders ({orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length})</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-md transition-all ${
                activeTab === 'menu' ? 'bg-white text-black shadow-sm' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Menu Items ({menuItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Live Orders View */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Incoming Kitchen Orders</h2>
                <p className="text-xs text-neutral-500">
                  Update preparation status as items move across cooking stations.
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center space-x-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-md text-xs font-semibold text-neutral-700 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Board</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-neutral-500">
                Loading kitchen orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-neutral-300 text-neutral-500 text-sm">
                No active orders at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-5 rounded-xl border border-neutral-300 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-black">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'preparing'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'ready_for_pickup'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-500 mb-3">
                        Student: <span className="font-semibold text-neutral-900">{order.studentId}</span> •{' '}
                        <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Items list */}
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-1.5 mb-3 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-medium">
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="text-neutral-500">Rs. {it.price * it.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                          <span>Total Paid:</span>
                          <span>Rs. {order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.specialInstructions && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mb-3">
                          <strong>Note:</strong> {order.specialInstructions}
                        </div>
                      )}
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-3 border-t border-neutral-200 flex items-center flex-wrap gap-2 text-xs">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                          className="bg-black hover:bg-neutral-800 text-white font-bold px-3 py-1.5 rounded transition-colors"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'ready_for_pickup')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition-colors"
                        >
                          Ready for Pickup
                        </button>
                      )}
                      {order.status === 'ready_for_pickup' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded transition-colors"
                        >
                          Mark Handed Over
                        </button>
                      )}
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                          className="text-red-600 hover:text-red-800 font-semibold px-2 py-1.5"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Management View matching canteen.html */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Add New Item Form matching canteen.html */}
            <div className="bg-white p-6 rounded-xl border border-neutral-300 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-2 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-black" />
                <span>Add New Menu Item</span>
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Add fresh meals and snacks directly to the live campus menu.
              </p>

              {formMsg && (
                <div
                  className={`text-xs p-3 rounded-lg mb-4 border ${
                    formMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {formMsg.text}
                </div>
              )}

              <form onSubmit={handleAddItem} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item Name (e.g. Masala Dosa, Cold Brew)"
                    className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Chinese & Indo-Chinese">Chinese & Indo-Chinese</option>
                    <option value="Noodles & Momos">Noodles & Momos</option>
                    <option value="Pizza & Specials">Pizza & Specials</option>
                    <option value="South Indian & Healthy">South Indian & Healthy</option>
                  </select>
                </div>

                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short appetizing description"
                  className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price (Rs)"
                    className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <input
                    type="number"
                    required
                    min="1"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="Preparation Time (minutes)"
                    className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="w-full text-xs sm:text-sm border border-neutral-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Adding to Menu...' : 'Add Item'}
                </button>
              </form>
            </div>

            {/* Menu Items List matching canteen.html */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-neutral-900">Active Menu Items ({menuItems.length})</h2>

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs flex items-center justify-between space-x-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover grayscale-card-img"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900">{item.name}</h3>
                        <p className="text-xs text-neutral-500 line-clamp-1">{item.description}</p>
                        <div className="flex items-center space-x-3 text-xs font-semibold text-neutral-800 mt-1">
                          <span>Price: Rs. {item.price}</span>
                          <span>•</span>
                          <span>Prep Time: {item.prepTime} mins</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item._id, item.name)}
                      className="bg-black hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

