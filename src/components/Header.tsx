'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  User as UserIcon,
  Sparkles,
  Store,
  Info,
  LogIn,
} from 'lucide-react';

export const Header: React.FC<{ onOpenAIChat: () => void }> = ({ onOpenAIChat }) => {
  const pathname = usePathname();
  const { user, setLoginModalOpen } = useAuth();
  const { totalItems, setCartDrawerOpen } = useCart();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About Us' },
  ];

  // If user is canteen owner or admin, display Canteen Portal link
  const showCanteenPortal = user?.role === 'canteen_owner' || user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-black text-white shadow-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
              Cd: <span className="text-teal-400">Zaika</span>
            </span>
            <span className="text-[10px] text-neutral-400 tracking-wider uppercase font-semibold">
              Campus Food Platform
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 uppercase tracking-wider ${
                  isActive ? 'text-teal-400 border-b-2 border-teal-400 pb-1' : 'text-neutral-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {showCanteenPortal && (
            <Link
              href="/canteen"
              className={`flex items-center space-x-1.5 text-xs uppercase font-bold px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 ${
                pathname === '/canteen' ? 'text-teal-400 border-teal-400' : 'text-neutral-200 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Canteen Portal</span>
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Zaika AI Assistant Trigger */}
          <button
            onClick={onOpenAIChat}
            className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-teal-300 border border-teal-500/40 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:shadow transition-all"
            title="Ask Zaika AI culinary assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2 rounded-full hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
            title="View Order Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile / Login Modal trigger */}
          {user ? (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 py-1.5 rounded-full transition-all text-xs text-neutral-200 hover:text-white"
            >
              <UserIcon className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold max-w-[90px] truncate">{user.studentId}</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 bg-white text-black font-semibold text-xs px-3.5 py-1.5 rounded-full hover:bg-neutral-200 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

