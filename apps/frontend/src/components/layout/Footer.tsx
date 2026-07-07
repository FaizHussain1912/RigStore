import React from 'react';
import { Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-rig-border bg-rig-surface mt-16">
      <div className="container-dense py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter text-rig-text shrink-0">
            <Cpu className="text-rig-primary" size={28} />
            <span>RIG<span className="text-rig-primary">STORE</span></span>
          </div>
          <p className="text-sm text-rig-muted leading-relaxed">
            The ultimate destination for PC enthusiasts. High-performance hardware, custom builder engine, and real-time inventory.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-rig-text font-bold mb-4 uppercase tracking-wider text-sm">Products</h4>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="nav-link">Processors</a></li>
            <li><a href="#" className="nav-link">Motherboards</a></li>
            <li><a href="#" className="nav-link">Graphic Cards</a></li>
            <li><a href="#" className="nav-link">Custom Builder</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-rig-text font-bold mb-4 uppercase tracking-wider text-sm">Support</h4>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="nav-link">Track Order</a></li>
            <li><a href="#" className="nav-link">Warranty & Returns</a></li>
            <li><a href="#" className="nav-link">Contact Us</a></li>
            <li><a href="#" className="nav-link">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-rig-text font-bold mb-4 uppercase tracking-wider text-sm">Stay Updated</h4>
          <p className="text-sm text-rig-muted mb-4">Subscribe to get notified about flash sales and new GPU restocks.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address..." 
              className="w-full bg-rig-background border border-rig-border rounded-l-sm py-2 px-3 text-sm focus:outline-none focus:border-rig-primary transition-colors"
            />
            <button className="bg-rig-primary text-white font-bold px-4 py-2 rounded-r-sm hover:bg-red-600 transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-rig-border py-6 text-center">
        <p className="text-xs text-rig-muted">
          &copy; {new Date().getFullYear()} RigStore. All rights reserved. Prices and specifications are subject to change without notice.
        </p>
      </div>
    </footer>
  );
}
