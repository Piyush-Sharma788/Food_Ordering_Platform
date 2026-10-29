'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IMenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Clock,
  Star,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function MenuPage() {
  const { cart, addItem, increaseQuantity, decreaseQuantity, deleteItem } = useCart();
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const categories = [
    'All',
    'Beverages',
    'Snacks',
    'Chinese & Indo-Chinese',
    'Noodles & Momos',
    'Pizza & Specials',
    'South Indian & Healthy',
  ];

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu-items');
        const data = await res.json();
        if (data.success && data.items) {
          setMenuItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemCartQuantity = (id: string): number => {
    const found = cart.find((ci) => ci.item._id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-neutral-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Campus Food Menu
          </h1>
          <button
            onClick={() => setShowReviewsModal(true)}
            className="flex items-center space-x-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Student Reviews</span>
          </button>
        </div>

        {/* Cafe Images Header Banner matching final_menu.html */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="relative h-44 rounded-lg overflow-hidden bg-neutral-200">
            <Image
              src="https://media.istockphoto.com/id/1148223648/photo/interior-of-a-pub.jpg?s=612x612&w=0&k=20&c=ol9gdn-NQRREHUydQ2loU6WpCSeUTjt8qFGekYDvx0o="
              alt="Cafe Interior"
              fill
              className="object-cover grayscale-card-img"
              unoptimized
            />
          </div>
          <div className="relative h-44 rounded-lg overflow-hidden bg-neutral-200">
            <Image
              src="https://founterior.com/wp-content/uploads/2014/09/Cafe-playground-in-the-backayrd.jpg"
              alt="Cafe Exterior"
              fill
              className="object-cover grayscale-card-img"
              unoptimized
            />
          </div>
          <div className="relative h-44 rounded-lg overflow-hidden bg-neutral-200">
            <Image
              src="https://media-cdn.tripadvisor.com/media/photo-o/0a/80/ac/eb/cafe-restaurant-amsterdam.jpg"
              alt="Cafe Ambiance"
              fill
              className="object-cover grayscale-card-img"
              unoptimized
            />
          </div>
        </div>

        {/* Motivational Banner matching final_menu.html */}
        <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs text-center mb-8">
          <p className="text-xs sm:text-sm text-neutral-700 italic font-medium">
            &ldquo;Indulge in our delightful menu. Remember, good food choices are a great way to nourish both body and soul!&rdquo;
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes, shakes, maggie, momos, pizzas..."
              className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items List matching final_menu.html card structure */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-lg p-4 border border-neutral-200 animate-pulse flex items-center space-x-4"
              >
                <div className="w-24 h-24 bg-neutral-200 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-1/3 h-5 bg-neutral-200 rounded" />
                  <div className="w-2/3 h-4 bg-neutral-100 rounded" />
                  <div className="w-1/4 h-4 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-300 text-neutral-500 text-sm">
            No dishes found matching your selection.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const qty = getItemCartQuantity(item._id);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg border border-neutral-200 shadow-xs p-4 flex flex-col sm:flex-row items-center sm:space-x-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Dish Image */}
                  <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 mb-3 sm:mb-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover grayscale-card-img"
                      sizes="112px"
                      unoptimized
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                      <h3 className="font-bold text-base text-neutral-900">{item.name}</h3>
                      {item.isVegetarian && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                          Veg
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 mb-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs font-semibold text-neutral-800">
                      <span className="text-black font-extrabold text-sm">
                        Price: Rs. {item.price}
                      </span>
                      <span className="flex items-center space-x-1 text-neutral-500 font-normal">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Prep Time: {item.prepTime} mins</span>
                      </span>
                    </div>

                    {/* Quantity Controls matching final_menu.html */}
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-3">
                      {qty === 0 ? (
                        <button
                          onClick={() => addItem(item)}
                          className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-4 py-1.5 rounded-md transition-all shadow-sm flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Tray</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decreaseQuantity(item._id)}
                            className="w-7 h-7 bg-black hover:bg-neutral-800 text-white rounded flex items-center justify-center text-sm font-bold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            readOnly
                            value={qty}
                            className="w-12 h-7 text-center font-bold text-sm border border-black rounded bg-white"
                          />

                          <button
                            onClick={() => increaseQuantity(item._id)}
                            className="w-7 h-7 bg-black hover:bg-neutral-800 text-white rounded flex items-center justify-center text-sm font-bold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => deleteItem(item._id)}
                            className="h-7 px-2.5 bg-white border border-black text-black hover:bg-black hover:text-white rounded text-xs font-semibold transition-colors flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="font-bold text-base text-neutral-900">Student Reviews & Ratings</h3>
              </div>
              <button
                onClick={() => setShowReviewsModal(false)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div className="flex justify-between font-bold text-neutral-900 mb-1">
                  <span>Aarav S. (3rd Year CS)</span>
                  <span className="text-amber-500 font-bold">★ 5.0</span>
                </div>
                <p className="text-neutral-600">
                  Kulhad Pizza and Vanilla Shake are unbeatable during midnight project sessions!
                </p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div className="flex justify-between font-bold text-neutral-900 mb-1">
                  <span>Priya P. (2nd Year EE)</span>
                  <span className="text-amber-500 font-bold">★ 4.5</span>
                </div>
                <p className="text-neutral-600">
                  Maggie Masaledar is freshly made and ready in 8 mins flat. Really appreciate the transparent prep time.
                </p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div className="flex justify-between font-bold text-neutral-900 mb-1">
                  <span>Rohan K. (1st Year Mech)</span>
                  <span className="text-amber-500 font-bold">★ 4.0</span>
                </div>
                <p className="text-neutral-600">
                  Paneer Burger is huge and filling for Rs. 75. Great affordable student prices.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReviewsModal(false)}
              className="mt-4 w-full bg-black text-white font-bold py-2 rounded-md text-xs hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

