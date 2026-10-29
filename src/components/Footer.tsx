import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <h3 className="text-white font-extrabold text-lg tracking-tight mb-2">
              Cd: <span className="text-teal-400">Zaika</span>
            </h3>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed mb-4">
              Flavours that fuel your study delivered with care. Modern campus food ordering,
              smart kitchen prep timers, and verified pricing.
            </p>
            <div className="flex flex-col space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <a href="mailto:cd.ugi@gmail.com" className="hover:text-white transition-colors">
                  cd.ugi@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>(+91) 8400976494</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Central Campus Food Court & Canteen</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Campus Eateries
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Complete Menu Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Team
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Student & Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Hours */}
          <div>
            <h4 className="text-white font-semibold uppercase text-xs tracking-wider mb-3">
              Operational Hours
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Monday – Sunday: 8:00 AM – 10:30 PM<br />
              Kitchen prep time updates automatically during rush hours.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <span className="inline-block bg-teal-950 text-teal-300 border border-teal-800/50 text-[11px] px-2.5 py-1 rounded">
                ● Canteen Kitchen Online
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Cd: Zaika. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for campus students</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

