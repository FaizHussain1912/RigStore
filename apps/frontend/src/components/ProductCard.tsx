"use client";

import { ShoppingCart, Heart, ArrowLeftRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../app/CartContext';
import { useCurrency } from '../app/CurrencyContext';
import { useWishlist } from '../app/WishlistContext';
import { useCompare } from '../app/CompareContext';

export default function ProductCard({ product, viewMode = 'grid' }: { product: any, viewMode?: 'grid' | 'list' }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  // Stock status
  const inStock = product.inventory ? (product.inventory.totalStock > 0) : true;

  // Discount calculation
  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100) 
    : 0;

  // Wishlist & Compare check
  const isWishlisted = wishlistItems.some(item => item.product.id === product.id);
  const isCompared = isInCompare(product.id);

  // Render spec list efficiently
  const specEntries = Object.entries(product.specs || {}).slice(0, 4);
  const isList = viewMode === 'list';

  return (
    <div className={`glass-panel group relative flex hover:border-rig-primary transition-colors duration-300 overflow-hidden ${isList ? 'flex-col md:flex-row' : 'flex-col h-full'}`}>
      
      {/* Product Image & Badges Container */}
      <div className={`relative bg-rig-background/80 shrink-0 border-rig-border/50 overflow-hidden ${isList ? 'w-full md:w-64 h-64 md:h-auto border-b md:border-b-0 md:border-r' : 'w-full aspect-square border-b'}`}>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock Overlay / Badge */}
        {!inStock && (
          <div className="absolute top-3 left-3 z-20 bg-black/80 border border-red-500/50 text-red-400 text-[10px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wider">
            Out of Stock
          </div>
        )}

        {/* Quick Action Buttons on Image */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="w-8 h-8 rounded-full bg-rig-surface/90 backdrop-blur-md border border-rig-border flex items-center justify-center text-rig-muted hover:text-red-500 hover:border-red-500/50 transition-colors shadow-sm"
          >
            <Heart size={15} className={isWishlisted ? "text-red-500 fill-red-500" : ""} />
          </button>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              isCompared ? removeFromCompare(product.id) : addToCompare(product);
            }}
            title={isCompared ? "Remove from compare" : "Add to compare"}
            className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors shadow-sm ${isCompared ? 'bg-rig-primary text-white border-rig-primary' : 'bg-rig-surface/90 border-rig-border text-rig-muted hover:text-rig-primary hover:border-rig-primary/50'}`}
          >
            {isCompared ? <Check size={14} /> : <ArrowLeftRight size={14} />}
          </button>
        </div>

        {product.imageUrl ? (
          <Link href={`/product/${product.slug}`} className="block w-full h-full p-4 relative">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              loading="lazy" 
              decoding="async" 
              className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'grayscale opacity-60' : 'opacity-90 group-hover:opacity-100'}`} 
            />
          </Link>
        ) : (
          <Link href={`/product/${product.slug}`} className="block w-full h-full p-4 flex items-center justify-center text-xs text-rig-muted font-mono">
            [ {product.brand} ]
          </Link>
        )}
      </div>

      {/* Product Content Details */}
      <div className={`p-4 flex-1 flex flex-col ${isList ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-between text-xs font-bold text-rig-muted uppercase tracking-widest mb-1">
          <span>{product.brand}</span>
          {inStock ? (
            <span className="text-green-500 text-[10px] lowercase font-medium">in stock</span>
          ) : (
            <span className="text-red-500 text-[10px] lowercase font-medium">sold out</span>
          )}
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-base font-bold leading-tight mb-2 text-rig-text hover:text-rig-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Specs list */}
        {specEntries.length > 0 && (
          <div className="bg-rig-background rounded p-2.5 mb-3 space-y-1 border border-rig-border text-[11px]">
            {specEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-rig-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-rig-text font-medium text-right ml-2 truncate max-w-[140px]">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price & Action Row */}
      <div className={`p-4 border-rig-border bg-gray-50/50 dark:bg-black/20 flex ${isList ? 'flex-row md:flex-col md:w-56 shrink-0 justify-between md:justify-center items-center gap-4 border-t md:border-t-0 md:border-l' : 'border-t items-center justify-between mt-auto'}`}>
        <div>
          <div className="text-lg font-black text-rig-primary leading-tight">
            {formatPrice(product.basePrice)}
          </div>
          {hasDiscount && (
            <div className="text-xs text-rig-muted line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>

        <button 
          onClick={() => addToCart(product)}
          disabled={!inStock}
          className={`p-2 px-3 rounded flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            inStock 
              ? 'bg-rig-primary hover:bg-rose-500 text-white shadow-sm hover:shadow' 
              : 'bg-rig-surface border border-rig-border text-rig-muted cursor-not-allowed opacity-60'
          } ${isList ? 'md:w-full md:py-2.5' : ''}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" /> 
          {inStock ? (isList ? 'Add to Cart' : 'Add') : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
