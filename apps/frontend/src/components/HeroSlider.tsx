"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShieldAlert, Zap } from 'lucide-react';
import Link from 'next/link';

interface BannerData {
  tagline: string;
  title1: string;
  title2: string;
  description: string;
  priceText: string;
  skuText: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function HeroSlider({ banners }: { banners: BannerData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Default fallback if no banners exist
  const activeBanners = banners && banners.length > 0 ? banners : [{
    tagline: 'Flash Drop Active',
    title1: 'NVIDIA GeForce',
    title2: 'RTX 4090 SUPRIM X',
    description: 'Limited inventory. Cart lock system active. Secure your 24GB GDDR6X flagship now.',
    priceText: 'Rs. 650,000',
    skuText: 'SKU: MS-4090-SPX',
    buttonText: 'Add to Cart',
    buttonLink: '#'
  }];

  const nextSlide = (manual = false) => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    if (manual) resetAutoSlide(5000);
  };

  const prevSlide = (manual = false) => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    if (manual) resetAutoSlide(5000);
  };

  const resetAutoSlide = (delay = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!isHovered && activeBanners.length > 1) {
      timeoutRef.current = setTimeout(() => {
        nextSlide(false);
        resetAutoSlide(3000); // Resume normal 3s interval after the delayed tick
      }, delay);
    }
  };

  useEffect(() => {
    resetAutoSlide(3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isHovered, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  return (
    <section 
      className="w-full bg-gradient-to-r from-rig-surface to-rig-dark border-b border-rig-border py-10 md:py-16 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Decorative Graphic */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 transition-transform duration-1000 ease-in-out">
        <Zap size={600} />
      </div>

      <div className="container-dense relative z-10 overflow-hidden">
        
        {activeBanners.length > 1 && (
          <>
            <button 
              onClick={() => prevSlide(true)}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-rig-background/80 hover:bg-rig-primary border border-rig-border hover:border-rig-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => nextSlide(true)}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-rig-background/80 hover:bg-rig-primary border border-rig-border hover:border-rig-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Sliding Track */}
        <div 
          className="w-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeBanners.map((banner, idx) => (
            <div key={idx} className="min-w-full w-full flex-shrink-0 flex flex-col md:flex-row items-center gap-8 justify-between px-1">
              
              <div className="flex flex-col items-start gap-4 max-w-2xl">
                <div className="bg-rig-primary/20 text-rig-primary border border-rig-primary/30 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm flex items-center gap-2">
                  <ShieldAlert size={14} /> {banner.tagline}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-rig-text tracking-tighter leading-tight">
                  {banner.title1} <br/><span className="text-rig-primary">{banner.title2}</span>
                </h1>
                <p className="text-rig-muted text-lg mt-2 font-medium">
                  {banner.description}
                </p>
                
                <div className="flex items-center gap-4 mt-4">
                  <Link href={banner.buttonLink || '#'} className="bg-rig-primary hover:bg-red-600 text-white font-bold py-3 px-8 transition-colors flex items-center gap-2">
                    {banner.buttonText || 'Add to Cart'} <ChevronRight size={18} />
                  </Link>
                  <div className="flex flex-col text-sm">
                    <span className="text-rig-text font-bold text-xl">{banner.priceText}</span>
                    <span className="text-rig-muted font-mono text-[11px]">{banner.skuText}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block w-96 h-64 bg-rig-surface border border-rig-border shadow-2xl relative rounded-md p-4">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,70,85,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse"></div>
                {/* Placeholder for Product Image */}
                <div className="w-full h-full flex items-center justify-center text-rig-muted font-mono text-sm border border-dashed border-rig-border/50">
                  [ Render Image {idx + 1} ]
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeBanners.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => { setCurrentIndex(idx); resetAutoSlide(5000); }}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-rig-primary w-6' : 'bg-rig-border hover:bg-rig-muted'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
