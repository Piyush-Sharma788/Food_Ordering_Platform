'use client';

import React, { useState } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileModal from '@/components/ProfileModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import AIChatDrawer from '@/components/AIChatDrawer';
import OrderSummaryBar from '@/components/OrderSummaryBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Cd: Zaika — Campus Food Ordering Platform</title>
        <meta
          name="description"
          content="Flavours that fuel your study delivered with care. Campus food ordering platform connecting students with eateries."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8f9fa] text-neutral-900 antialiased selection:bg-teal-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Header onOpenAIChat={() => setAiChatOpen(true)} />
            <main className="flex-1 pb-24">{children}</main>
            <Footer />
            <ProfileModal />
            <CartDrawer />
            <CheckoutModal />
            <AIChatDrawer isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
            <OrderSummaryBar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

