'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, MessageCircle, ChevronUp } from 'lucide-react';

export default function Footer({ settings }: { settings?: any }) {
  const s = settings || {};
  const desc = s.description || "Welcome to RigStore. Online computer hardware store in Pakistan. Buy Custom PCs, Processors, Graphic Cards, and Gaming accessories at the best prices in Pakistan.";
  const address = s.address || "FL 4/20, Main Rashid Minhas Road, Gulshan-e-Iqbal Block-5, Karachi, Pakistan.";
  const contact = s.contactNumber || "+92 316 2975195";
  const email = s.email || "support@rigstore.pk";
  const productLinks = Array.isArray(s.productLinks) && s.productLinks.length > 0 
    ? s.productLinks 
    : [
        { label: "Laptops", url: "/category/laptops" },
        { label: "Processors", url: "/category/processors" },
        { label: "Graphic Cards", url: "/category/gpus" },
        { label: "LCD/LED Monitors", url: "/category/monitors" },
        { label: "Storage & SSDs", url: "/category/storage" },
        { label: "Accessories", url: "/category/accessories" },
      ];
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-rig-surface border-t border-rig-border mt-16 text-sm">
      <div className="container-dense py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Store Info */}
          <div className="space-y-6 lg:pr-8">
            <p className="text-rig-muted leading-relaxed">
              {desc}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-rig-muted">
                <MapPin className="w-5 h-5 shrink-0 text-rig-primary" />
                <span>{address}</span>
              </div>
              <div className="flex items-start gap-3 text-rig-muted">
                <Phone className="w-5 h-5 shrink-0 text-rig-primary" />
                <span>{contact}</span>
              </div>
              <div className="flex items-start gap-3 text-rig-muted">
                <Mail className="w-5 h-5 shrink-0 text-rig-primary" />
                <span>{email}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-rig-background border border-rig-border flex items-center justify-center text-rig-muted hover:text-white hover:border-rig-primary hover:bg-rig-primary/10 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-rig-background border border-rig-border flex items-center justify-center text-rig-muted hover:text-white hover:border-rig-primary hover:bg-rig-primary/10 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-rig-background border border-rig-border flex items-center justify-center text-rig-muted hover:text-white hover:border-rig-primary hover:bg-rig-primary/10 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-rig-background border border-rig-border flex items-center justify-center text-rig-muted hover:text-white hover:border-rig-primary hover:bg-rig-primary/10 transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-rig-background border border-rig-border flex items-center justify-center text-rig-muted hover:text-white hover:border-rig-primary hover:bg-rig-primary/10 transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="text-rig-text font-bold text-lg mb-6 tracking-tight">Products</h3>
            <ul className="space-y-3">
              {productLinks.map((link: any, idx: number) => (
                <li key={idx}><Link href={link.url || '#'} className="text-rig-muted hover:text-rig-primary transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h3 className="text-rig-text font-bold text-lg mb-6 tracking-tight">Account</h3>
            <ul className="space-y-3">
              <li><Link href="/auth" className="text-rig-muted hover:text-rig-primary transition-colors">Sign In / Sign Up</Link></li>
              <li><Link href="/checkout" className="text-rig-muted hover:text-rig-primary transition-colors">My Account</Link></li>
              <li><Link href="/checkout" className="text-rig-muted hover:text-rig-primary transition-colors">Shopping Cart</Link></li>
              <li><Link href="/checkout" className="text-rig-muted hover:text-rig-primary transition-colors">Order History</Link></li>
            </ul>
          </div>

          {/* Column 4: Corporate */}
          <div>
            <h3 className="text-rig-text font-bold text-lg mb-6 tracking-tight">Corporate</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-rig-muted hover:text-rig-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-rig-muted hover:text-rig-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-rig-muted hover:text-rig-primary transition-colors">Return & Exchange</Link></li>
              <li><Link href="#" className="text-rig-muted hover:text-rig-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-rig-background border-t border-rig-border py-4 relative">
        <div className="container-dense flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-rig-muted">
          <p>© {new Date().getFullYear()} RigStore. All Rights Reserved.</p>
          <p>Powered by <span className="text-rig-primary">RigStore Commerce</span></p>
        </div>

        {/* Scroll to top button */}
        <button 
          onClick={scrollToTop}
          className="absolute -top-5 right-6 md:right-12 w-10 h-10 bg-rig-primary text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform border border-rig-primary/50"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </footer>
  );
}
