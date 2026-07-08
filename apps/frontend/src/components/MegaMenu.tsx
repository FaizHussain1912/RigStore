"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Cpu, CircuitBoard, MemoryStick, MonitorPlay, Power, Box, Fan, HardDrive, Laptop, MonitorSmartphone, Headphones, Mouse, Keyboard, Cable } from 'lucide-react';

const CATEGORIES = [
  { name: 'Processors', slug: 'processors', icon: Cpu, desc: 'Intel Core & AMD Ryzen CPUs' },
  { name: 'Motherboards', slug: 'motherboards', icon: CircuitBoard, desc: 'LGA1700, AM5, and AM4 Boards' },
  { name: 'Memory', slug: 'memory', icon: MemoryStick, desc: 'DDR4 and DDR5 RAM Kits' },
  { name: 'Graphic Cards', slug: 'gpus', icon: MonitorPlay, desc: 'NVIDIA RTX & AMD Radeon GPUs' },
  { name: 'Power Supplies', slug: 'psus', icon: Power, desc: '80+ Gold and Platinum PSUs' },
  { name: 'Cases', slug: 'cases', icon: Box, desc: 'ATX, ITX, and E-ATX Chassis' },
  { name: 'Coolers', slug: 'coolers', icon: Fan, desc: 'AIO Liquid and Tower Air Coolers' },
  { name: 'Storage', slug: 'storage', icon: HardDrive, desc: 'NVMe Gen4 and SATA SSDs' },
  { name: 'Laptops', slug: 'laptops', icon: Laptop, desc: 'Gaming and Creator Laptops' },
  { name: 'Desktops', slug: 'desktops', icon: Box, desc: 'Pre-built Gaming PCs' },
  { name: 'Monitors', slug: 'monitors', icon: MonitorSmartphone, desc: 'High Refresh Rate Displays' },
  { name: 'Headphones', slug: 'headphones', icon: Headphones, desc: 'Gaming Headsets & Audio' },
  { name: 'Mice', slug: 'mice', icon: Mouse, desc: 'Esports Wireless Mice' },
  { name: 'Keyboards', slug: 'keyboards', icon: Keyboard, desc: 'Mechanical Keyboards' },
  { name: 'Peripherals', slug: 'peripherals', icon: Cable, desc: 'Cables, Webcams, USBs' },
];

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 font-medium text-sm text-rig-muted hover:text-rig-text transition-colors py-4">
        Products <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      <div className={`absolute top-full left-0 w-[800px] bg-rig-surface border border-rig-border shadow-2xl rounded-b-lg overflow-hidden transition-all duration-200 z-50 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
        <div className="p-6 grid grid-cols-3 gap-x-8 gap-y-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`}
                prefetch={true}
                className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors group/item"
              >
                <div className="p-2 rounded bg-rig-background border border-rig-border group-hover/item:border-rig-primary transition-colors">
                  <Icon className="w-5 h-5 text-rig-primary" />
                </div>
                <div>
                  <h4 className="text-rig-text font-semibold text-sm mb-1">{cat.name}</h4>
                  <p className="text-xs text-rig-muted">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="bg-rig-background p-4 border-t border-rig-border flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/builder" prefetch={true} className="text-sm font-semibold text-rig-primary hover:text-rose-400 transition-colors">
            Not sure what to buy? Try our Custom PC Builder →
          </Link>
          <div className="hidden md:block w-px h-4 bg-rig-border"></div>
          <Link href="/deals" prefetch={true} className="text-sm font-black text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1">
            🔥 View Exclusive PC Deals
          </Link>
        </div>
      </div>
    </div>
  );
}
