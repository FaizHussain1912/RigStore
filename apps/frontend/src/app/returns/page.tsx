import React from 'react';
import { RotateCcw, ShieldCheck, Clock, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Return & Exchange Policy | RigStore',
  description: 'Learn about RigStore hassle-free 7-day return and exchange policy for computer parts and gaming rigs.',
};

export default function ReturnsPage() {
  return (
    <div className="container-dense py-12 md:py-20 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-rig-primary font-bold tracking-wider text-xs uppercase bg-rig-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
          Customer Protection
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Return & <span className="text-rig-primary">Exchange Policy</span>
        </h1>
        <p className="text-rig-muted text-base max-w-xl mx-auto">
          We want you to be 100% satisfied with your hardware. If something isn't right, we're here to make it right.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-rig-surface border border-rig-border p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary mb-4">
            <Clock size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">7 Days Checking</h3>
          <p className="text-xs text-rig-muted">7 days replacement warranty on all boxed hardware components.</p>
        </div>

        <div className="bg-rig-surface border border-rig-border p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">100% Authentic</h3>
          <p className="text-xs text-rig-muted">Official brand warranties with verified serial numbers.</p>
        </div>

        <div className="bg-rig-surface border border-rig-border p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary mb-4">
            <Truck size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">Nationwide Pickup</h3>
          <p className="text-xs text-rig-muted">Courier doorstep pickup available for eligible warranty claims.</p>
        </div>
      </div>

      <div className="space-y-8 bg-rig-surface border border-rig-border p-8 rounded-2xl text-rig-text">
        <section>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="text-rig-primary w-5 h-5" /> 1. Eligibility for Returns & Replacements
          </h2>
          <p className="text-sm text-rig-muted leading-relaxed mb-3">
            Products are eligible for return or replacement within <strong>7 days of delivery</strong> under the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-rig-muted pl-2">
            <li>Item arrived physically damaged or dead on arrival (DOA).</li>
            <li>Item does not match the specifications or SKU ordered.</li>
            <li>All original packaging, accessories, manuals, and warranty seals must be intact.</li>
          </ul>
        </section>

        <section className="border-t border-rig-border/50 pt-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500 w-5 h-5" /> 2. Non-Returnable Items
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-rig-muted pl-2">
            <li>Products damaged due to electrical surges, improper installation, or bent CPU pins.</li>
            <li>Items with missing original manufacturer serial number stickers or tampered warranty seals.</li>
            <li>Software, digital keys, or custom water-cooling fluid once opened.</li>
          </ul>
        </section>

        <section className="border-t border-rig-border/50 pt-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <RotateCcw className="text-rig-primary w-5 h-5" /> 3. How to Initiate a Claim
          </h2>
          <p className="text-sm text-rig-muted leading-relaxed mb-3">
            Contact our dedicated support team with your <strong>Order ID</strong> and video/photo evidence of the issue:
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/contact" className="bg-rig-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-rig-primary/90 text-sm">
              Contact Support
            </Link>
            <a href="https://wa.me/923262147419" target="_blank" rel="noopener noreferrer" className="bg-[#25d366] text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-[#20bd5a] text-sm">
              WhatsApp: 0326-2147419
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
