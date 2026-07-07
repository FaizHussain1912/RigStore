import React from 'react';
import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="w-full bg-[#111111] border-b border-rig-border text-xs text-rig-muted py-2 px-4 z-50 relative">
      <div className="container-dense flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left Side Links */}
        <div className="flex items-center gap-4 font-medium">
          <Link href="/about" className="hover:text-rig-text transition-colors">
            About Us
          </Link>
          <Link 
            href="/contact" 
            className="text-rig-primary bg-rig-primary/10 px-3 py-1 rounded-md hover:bg-rig-primary/20 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-6 font-medium">
          <div className="flex items-center gap-1.5 hover:text-rig-text transition-colors cursor-pointer">
            <Phone size={14} className="text-rig-primary" />
            <span>0326-2147419</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-rig-text transition-colors cursor-pointer">
            <MapPin size={14} className="text-rig-primary" />
            <span>Karachi, Pakistan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
