'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IRestaurant } from '@/types';
import {
  UtensilsCrossed,
  Star,
  Search,
  Sparkles,
  ArrowRight,
  Coffee,
  Soup,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Canteen', 'Cafe', 'Dhaba'];

  useEffect(() => {
    async function fetchEateries() {
      try {
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        if (data.success && data.restaurants) {
          setRestaurants(data.restaurants);
        }
      } catch (err) {
        console.error('Failed to load eateries:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEateries();
  }, []);

  const filteredEateries = restaurants.filter((r) => {
    const matchesCategory =
      selectedCategory === 'All' || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Header matching Final_home.html */}
      <section className="relative bg-black text-white py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-700 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Campus Dining Reimagined</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Cd: <span className="text-teal-400">Zaika</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto font-light italic">
            &ldquo;Flavours that fuel your study delivered with care&rdquo;
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-xl mx-auto flex items-center">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campus canteen, cafe, sandwiches, coffee..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link
            href="/menu"
            className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900 hover:text-teal-600 transition-colors uppercase tracking-wider"
          >
            <span>View Full Menu (20+ Items)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Highlight Banner */}
        <div className="mb-10 bg-gradient-to-r from-neutral-950 via-black to-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Need food fast between lectures?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                Zaika AI calculates dynamic kitchen wait times and suggests snacks ready in under 5 minutes.
              </p>
            </div>
          </div>
          <Link
            href="/menu"
            className="flex-shrink-0 bg-teal-400 hover:bg-teal-300 text-black font-extrabold px-5 py-2.5 rounded-full text-xs transition-all tracking-wide shadow-sm"
          >
            Order Hot Meal Now
          </Link>
        </div>

        {/* Eateries Grid matching Final_home.html */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Campus Eateries & Canteens
            </h2>
            <span className="text-xs text-neutral-500">
              Showing {filteredEateries.length} dining spots
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl border border-neutral-200 p-4 h-80 animate-pulse space-y-4"
                >
                  <div className="w-full h-44 bg-neutral-200 rounded-lg" />
                  <div className="w-2/3 h-5 bg-neutral-200 rounded" />
                  <div className="w-full h-4 bg-neutral-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredEateries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-neutral-200 text-neutral-500 text-sm">
              No campus eateries matched your query. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEateries.map((eatery) => (
                <div
                  key={eatery._id}
                  className="group bg-white rounded-xl border-2 border-black p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Eatery Image with legacy grayscale hover effect */}
                    <div className="relative w-full h-52 rounded-lg overflow-hidden mb-4 bg-neutral-100">
                      <Image
                        src={eatery.imageUrl}
                        alt={eatery.name}
                        fill
                        className="object-cover grayscale-card-img"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider border border-white/20">
                        {eatery.category}
                      </span>
                    </div>

                    {/* Eatery Info */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-lg text-neutral-900 group-hover:text-black transition-colors flex items-center space-x-1.5">
                        {eatery.category === 'Cafe' ? (
                          <Coffee className="w-4 h-4 text-neutral-700" />
                        ) : eatery.category === 'Dhaba' ? (
                          <Soup className="w-4 h-4 text-neutral-700" />
                        ) : (
                          <UtensilsCrossed className="w-4 h-4 text-neutral-700" />
                        )}
                        <span>{eatery.name}</span>
                      </h3>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-800 mb-2">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span>{eatery.rating.toFixed(1)}</span>
                      <span className="text-neutral-400 font-normal">
                        ({eatery.reviewCount || 100}+ reviews)
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                      {eatery.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {eatery.openingHours || '08:00 AM - 10:00 PM'}
                    </span>
                    <Link
                      href="/menu"
                      className="inline-flex items-center space-x-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                      <span>Explore Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feature pillars */}
        <section className="mt-16 pt-12 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-xl border border-neutral-200">
            <div className="w-10 h-10 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-900">
              ⚡
            </div>
            <h4 className="font-bold text-sm text-neutral-900 mb-1">
              Live Prep Time Algorithm
            </h4>
            <p className="text-xs text-neutral-500">
              Orders scale preparation time realistically so you never wait unexpectedly at the counter.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200">
            <div className="w-10 h-10 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-900">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900 mb-1">
              Verified Student Pricing
            </h4>
            <p className="text-xs text-neutral-500">
              Transparent campus pricing with zero surge fees and instant student ID account billing.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200">
            <div className="w-10 h-10 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-900">
              📄
            </div>
            <h4 className="font-bold text-sm text-neutral-900 mb-1">
              Puppeteer PDF Invoices
            </h4>
            <p className="text-xs text-neutral-500">
              Download and print verifiable digital order receipts for hostel reimbursements and records.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

