'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '../CompareContext';
import { useCart } from '../CartContext';
import { useCurrency } from '../CurrencyContext';
import { ArrowLeftRight, Trash2, ShoppingCart, Check, X, ShieldCheck } from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  // Extract all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap(p => Object.keys(p.specs || {}))
    )
  );

  if (compareList.length === 0) {
    return (
      <main className="container-dense py-20 text-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-full bg-rig-surface border border-rig-border flex items-center justify-center mx-auto mb-4 text-rig-muted">
          <ArrowLeftRight size={32} />
        </div>
        <h1 className="text-3xl font-black text-rig-text mb-2">No Products in Compare</h1>
        <p className="text-sm text-rig-muted max-w-md mx-auto mb-8">
          You haven't added any hardware components to compare. Browse our catalog and click the compare icon on any item to view them side-by-side.
        </p>
        <Link href="/category/all" className="bg-rig-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-rig-primary/90 text-sm">
          Browse Hardware Catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="container-dense py-10 min-h-[80vh]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-rig-border pb-4">
        <div>
          <span className="text-xs font-bold text-rig-primary uppercase tracking-wider">Hardware Benchmark</span>
          <h1 className="text-3xl font-black text-rig-text tracking-tight">Side-by-Side Comparison</h1>
          <p className="text-xs text-rig-muted mt-1">Comparing {compareList.length} of 4 items</p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="min-w-[700px] bg-rig-surface border border-rig-border rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-rig-border bg-rig-background/40">
                <th className="p-4 w-44 font-bold text-xs text-rig-muted uppercase">Specification</th>
                {compareList.map((p) => {
                  const inStock = p.inventory ? p.inventory.totalStock > 0 : true;
                  return (
                    <th key={p.id} className="p-4 w-64 align-top border-l border-rig-border">
                      <div className="relative group">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-1 -right-1 text-rig-muted hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <X size={16} />
                        </button>
                        <div className="w-28 h-28 bg-rig-background rounded-xl p-2 mb-3 border border-rig-border flex items-center justify-center mx-auto">
                          <img src={p.imageUrl || '/images/gpu.png'} alt={p.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[10px] font-bold text-rig-primary uppercase tracking-wider block mb-1">{p.brand}</span>
                        <Link href={`/product/${p.slug}`} className="text-xs font-bold text-rig-text hover:text-rig-primary line-clamp-2 leading-tight">
                          {p.name}
                        </Link>
                        <div className="text-base font-black text-rig-primary mt-2">
                          {formatPrice(p.basePrice)}
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => addToCart(p)}
                            disabled={!inStock}
                            className="w-full bg-rig-primary hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ShoppingCart size={13} /> {inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-rig-border/50 text-xs">
              {/* Category */}
              <tr>
                <td className="p-4 font-bold text-rig-muted bg-rig-background/20">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 border-l border-rig-border font-medium text-rig-text">
                    {p.category?.name || 'Hardware'}
                  </td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr>
                <td className="p-4 font-bold text-rig-muted bg-rig-background/20">Stock Status</td>
                {compareList.map((p) => {
                  const inStock = p.inventory ? p.inventory.totalStock > 0 : true;
                  return (
                    <td key={p.id} className="p-4 border-l border-rig-border">
                      <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${inStock ? 'text-green-500' : 'text-red-500'}`}>
                        {inStock ? <><Check size={13} /> In Stock ({p.inventory?.totalStock || 'Available'})</> : <><X size={13} /> Sold Out</>}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Warranty */}
              <tr>
                <td className="p-4 font-bold text-rig-muted bg-rig-background/20">Warranty</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 border-l border-rig-border font-medium text-rig-text">
                    1 Year Official Brand Warranty
                  </td>
                ))}
              </tr>

              {/* Dynamic Specs */}
              {allSpecKeys.map((key) => (
                <tr key={key}>
                  <td className="p-4 font-bold text-rig-muted bg-rig-background/20 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-l border-rig-border font-medium text-rig-text">
                      {p.specs?.[key] ? String(p.specs[key]) : <span className="text-rig-muted/40">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
