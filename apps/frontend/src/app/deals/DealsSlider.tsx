"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShieldAlert, ShoppingCart } from 'lucide-react';
import { useCart } from '../CartContext';
import { useCurrency } from '../CurrencyContext';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  slug: string;
}

export default function DealsSlider({ deals }: { deals: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const nextSlide = (manual = false) => {
    setCurrentIndex((prev) => (prev + 1) % deals.length);
    if (manual) resetAutoSlide(5000);
  };

  const prevSlide = (manual = false) => {
    setCurrentIndex((prev) => (prev - 1 + deals.length) % deals.length);
    if (manual) resetAutoSlide(5000);
  };

  const resetAutoSlide = (delay = 4000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!isHovered && deals.length > 1) {
      timeoutRef.current = setTimeout(() => {
        nextSlide(false);
        resetAutoSlide(4000);
      }, delay);
    }
  };

  useEffect(() => {
    resetAutoSlide(4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isHovered, deals.length]);

  if (!deals || deals.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl text-rig-muted">No Deals Currently Active</h2>
      </div>
    );
  }

  const currentDeal = deals[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative">
      <div 
        className="relative bg-rig-surface rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden shadow-2xl border border-rig-border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Navigation Buttons (Absolute) */}
        {deals.length > 1 && (
          <>
            <button 
              onClick={() => prevSlide(true)}
              className="absolute left-4 z-10 w-12 h-12 rounded-full border border-rig-border bg-rig-background flex items-center justify-center text-rig-muted hover:text-rig-primary hover:border-rig-primary transition-all shadow-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => nextSlide(true)}
              className="absolute right-4 z-10 w-12 h-12 rounded-full border border-rig-border bg-rig-background flex items-center justify-center text-rig-muted hover:text-rig-primary hover:border-rig-primary transition-all shadow-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Content Section */}
        <div className="flex-1 space-y-6 z-10 pl-8 md:pl-12">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/5">
            <ShieldAlert size={14} />
            {currentDeal.brand || 'PC STEAL DEAL'}
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-rig-text">
              {currentDeal.name}
            </h2>
            <h3 className="text-4xl md:text-6xl font-black text-blue-600 dark:text-blue-500 leading-tight">
              {currentDeal.slug.replace('pc-deal-', '').replace(/-/g, ' ').toUpperCase() + ' PC'}
            </h3>
          </div>

          {/* Description / Specs */}
          <p className="text-lg text-rig-muted max-w-2xl leading-relaxed">
            {currentDeal.description}
          </p>

          {/* Price & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 mt-6 border-t border-rig-border/50">
            <button 
              onClick={() => addToCart(currentDeal)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-colors shadow-xl shadow-blue-500/20"
            >
              <ShoppingCart size={20} />
              Add to Cart <ChevronRight size={18} />
            </button>
            
            <div className="flex flex-col">
              <span className="text-3xl font-black text-rig-text">{formatPrice(currentDeal.basePrice)}</span>
              <span className="text-xs text-rig-muted font-mono tracking-widest uppercase">SKU: {currentDeal.sku}</span>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 w-full max-w-lg relative min-h-[400px] flex items-center justify-center p-8 bg-rig-background rounded-2xl border border-rig-border/50 border-dashed">
          {currentDeal.imageUrl ? (
            <img 
              src={currentDeal.imageUrl} 
              alt={currentDeal.name}
              className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-rig-muted font-mono">[ Render Image ]</div>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      {deals.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          {deals.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index); resetAutoSlide(5000); }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-8 h-2 bg-blue-600' 
                  : 'w-2 h-2 bg-rig-border hover:bg-rig-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
