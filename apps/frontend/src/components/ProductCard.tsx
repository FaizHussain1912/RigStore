"use client";

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../app/CartContext';
import { useCurrency } from '../app/CurrencyContext';

export default function ProductCard({ product, viewMode = 'grid' }: { product: any, viewMode?: 'grid' | 'list' }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  // Render spec list efficiently
  const specEntries = Object.entries(product.specs || {}).slice(0, 4);

  const isList = viewMode === 'list';

  return (
    <div className={`glass-panel flex hover:border-rig-primary transition-colors duration-300 overflow-hidden ${isList ? 'flex-col md:flex-row' : 'flex-col h-full'}`}>
      {product.imageUrl && (
        <Link href={`/product/${product.slug}`} className={`relative bg-rig-background/80 block shrink-0 border-rig-border/50 ${isList ? 'w-full md:w-64 h-64 md:h-auto border-b md:border-b-0 md:border-r' : 'w-full aspect-square border-b'}`}>
          <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-contain p-4 opacity-90 hover:opacity-100 transition-opacity" />
        </Link>
      )}
      <div className={`p-4 flex-1 flex flex-col ${isList ? 'justify-center' : ''}`}>
        <div className="text-xs font-bold text-rig-muted uppercase tracking-widest mb-1">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-bold leading-tight mb-2 text-rig-text hover:text-rig-primary transition-colors">{product.name}</h3>
        </Link>
        
        {/* Specs list - CZone style dense specs */}
        <div className="bg-rig-background rounded p-3 mb-4 space-y-1 border border-rig-border">
          {specEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-rig-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-rig-text font-medium text-right ml-2 break-words">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`p-4 border-rig-border bg-gray-50 dark:bg-black/20 flex ${isList ? 'flex-row md:flex-col md:w-56 shrink-0 justify-between md:justify-center items-center gap-4 border-t md:border-t-0 md:border-l' : 'border-t items-center justify-between mt-auto'}`}>
        <div className="text-xl font-black text-rig-primary">{formatPrice(product.basePrice)}</div>
        <button 
          onClick={() => addToCart(product)}
          className={`bg-rig-primary hover:bg-rose-500 text-white p-2 rounded flex items-center justify-center gap-2 text-sm font-bold transition-colors ${isList ? 'md:w-full md:py-3' : ''}`}
        >
          <ShoppingCart className="w-4 h-4" /> Add{isList ? ' to Cart' : ''}
        </button>
      </div>
    </div>
  );
}
