import React from 'react';
import { Search, ShoppingCart, User, Cpu, Menu, X, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Processors',
    subcategories: [
      { title: 'Intel', links: ['Core i9 (14th Gen)', 'Core i7 (14th Gen)', 'Core i5 (14th Gen)', 'Older Generations'] },
      { title: 'AMD', links: ['Ryzen 9 (7000 Series)', 'Ryzen 7 (7000 Series)', 'Ryzen 5 (7000 Series)', 'Threadripper'] }
    ]
  },
  {
    name: 'Motherboards',
    subcategories: [
      { title: 'Intel Chipset', links: ['Z790 (LGA1700)', 'B760 (LGA1700)', 'H610 (LGA1700)', 'Z690'] },
      { title: 'AMD Chipset', links: ['X670E / X670 (AM5)', 'B650E / B650 (AM5)', 'A620 (AM5)', 'X570 (AM4)'] }
    ]
  },
  {
    name: 'Graphic Cards',
    subcategories: [
      { title: 'NVIDIA GeForce', links: ['RTX 4090', 'RTX 4080 Super', 'RTX 4070 Ti Super', 'RTX 4060 Ti'] },
      { title: 'AMD Radeon', links: ['RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 7600'] }
    ]
  },
  { name: 'Memory', subcategories: [{ title: 'Desktop RAM', links: ['DDR5 Kits', 'DDR4 Kits'] }, { title: 'Laptop RAM', links: ['SO-DIMM DDR5', 'SO-DIMM DDR4'] }] },
  { name: 'Storage', subcategories: [{ title: 'Solid State Drives', links: ['M.2 NVMe Gen5', 'M.2 NVMe Gen4', 'SATA 2.5" SSD'] }, { title: 'Hard Drives', links: ['Desktop HDD 3.5"', 'NAS Drives'] }] },
  { name: 'Power Supplies', subcategories: [{ title: 'By Wattage', links: ['1000W & Above', '850W - 1000W', '650W - 850W'] }, { title: 'By Standard', links: ['ATX 3.0 / PCIe 5.0', 'SFX (Small Form Factor)'] }] },
  { name: 'Cases', subcategories: [] }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-rig-border bg-rig-background/95 backdrop-blur supports-[backdrop-filter]:bg-rig-background/80">
      
      {/* Top Bar (Logo, Search, Actions) */}
      <div className="container-dense flex h-16 items-center justify-between gap-4 md:gap-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter text-rig-text shrink-0 cursor-pointer">
          <Cpu className="text-rig-primary" size={28} />
          <span>RIG<span className="text-rig-primary">STORE</span></span>
        </div>

        {/* Search Bar - Wide on desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <input 
            type="text" 
            placeholder="Search by part number, series, or specs (e.g. 'RTX 4070', 'Z790')..." 
            className="w-full bg-rig-surface border border-rig-border rounded-sm py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-rig-primary transition-colors"
          />
          <button className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-rig-muted hover:text-rig-text transition-colors bg-rig-surface border-l border-rig-border">
            <Search size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          
          <button className="flex flex-col items-center gap-1 text-rig-muted hover:text-rig-text transition-colors group">
            <User size={20} className="group-hover:text-rig-primary transition-colors" />
            <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">Account</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-rig-muted hover:text-rig-text transition-colors relative group">
            <div className="relative">
              <ShoppingCart size={20} className="group-hover:text-rig-primary transition-colors" />
              <span className="absolute -top-2 -right-2 bg-rig-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">Cart</span>
          </button>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-rig-muted hover:text-rig-text">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mega-Menu Navigation Bar */}
      <div className="hidden md:flex container-dense h-12 items-center gap-1">
        {/* "PC Builder" Highlight Link */}
        <div className="flex items-center mr-4">
          <button className="bg-rig-primary text-white text-sm font-bold px-4 py-1.5 rounded-sm flex items-center gap-2 hover:bg-red-600 transition-colors">
            Custom PC Builder
          </button>
        </div>

        {/* Categories Map */}
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="h-full flex items-center mega-menu-trigger relative">
            <button className="px-3 py-2 text-sm font-medium text-rig-text hover:text-rig-text hover:bg-rig-surface transition-all flex items-center gap-1">
              {cat.name}
            </button>
            
            {/* Mega Menu Dropdown */}
            {cat.subcategories.length > 0 && (
              <div className="mega-menu-content">
                <div className="absolute top-0 left-0 w-[600px] glass-panel border-t-2 border-t-rig-primary p-6 grid grid-cols-2 gap-8">
                  {cat.subcategories.map((sub, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-3">
                      <h3 className="text-rig-text font-bold text-sm uppercase tracking-wider border-b border-rig-border pb-2">{sub.title}</h3>
                      <ul className="flex flex-col gap-2">
                        {sub.links.map((link, lIdx) => (
                          <li key={lIdx}>
                            <a href="#" className="text-sm text-rig-muted hover:text-rig-primary transition-colors flex items-center gap-1 group">
                              <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
