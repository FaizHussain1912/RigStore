'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext';
import { ShoppingCart, Heart, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { useCurrency } from '../../CurrencyContext';

interface ProductClientProps {
  slug: string;
  initialProduct: any;
}

export default function ProductClient({ slug, initialProduct }: ProductClientProps) {
  const [product, setProduct] = useState<any>(initialProduct);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  if (!product) {
    return (
      <div className="container-dense pt-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-rig-text mb-4">Product Not Found</h1>
        <p className="text-rig-muted">We could not find this product.</p>
        <Link href="/" className="mt-8 text-rig-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const inStock = product.inventory?.totalStock > 0;
  const specs = Object.entries(product.specs || {}).filter(([k, v]) => v);
  const isWishlisted = wishlistItems.some(item => item.product.id === product.id);

  return (
    <div className="container-dense py-12 lg:py-24 animate-in fade-in duration-500">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-rig-muted mb-8 font-medium">
        <Link href="/" className="hover:text-rig-text transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/category/${product.category?.slug}`} className="hover:text-rig-text transition-colors">{product.category?.name}</Link>
        <ChevronRight size={14} />
        <span className="text-rig-text">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left: Image Viewer (Placeholder) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-square bg-rig-surface border border-rig-border rounded-2xl flex items-center justify-center p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain relative z-10" />
            ) : (
              <div className="text-rig-muted font-mono text-sm border border-dashed border-rig-border/50 p-12 rounded relative z-10">
                [ Product Image {product.sku} ]
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="text-xs font-bold text-rig-primary uppercase tracking-widest mb-2 flex items-center gap-2">
            {product.brand}
            <span className="w-1.5 h-1.5 rounded-full bg-rig-primary"></span>
            <span className="text-rig-muted">{product.category?.name}</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold text-rig-text mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-bold text-rig-text">{formatPrice(product.basePrice)}</div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${inStock ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </div>
          </div>

          <div className="mb-8 text-rig-muted leading-relaxed">
            {product.description}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => addToCart(product)}
              disabled={!inStock}
              className="flex-1 bg-rig-primary hover:bg-rose-500 disabled:bg-rig-border disabled:text-rig-muted text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={20} />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button 
              onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
              className="bg-rig-surface border border-rig-border hover:border-rig-primary text-rig-text font-bold px-6 py-4 rounded-xl flex items-center justify-center transition-colors group"
            >
              <Heart size={20} className={`transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-rig-muted group-hover:text-rig-primary'}`} />
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rig-surface border border-rig-border">
              <Truck className="text-rig-primary w-6 h-6" />
              <div className="text-sm font-medium text-rig-text">Fast Delivery<br/><span className="text-xs text-rig-muted">Nationwide</span></div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rig-surface border border-rig-border">
              <ShieldCheck className="text-rig-primary w-6 h-6" />
              <div className="text-sm font-medium text-rig-text">1 Year Warranty<br/><span className="text-xs text-rig-muted">Official Brand</span></div>
            </div>
          </div>

          {/* Specifications */}
          {specs.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-rig-text mb-4">Specifications</h3>
              <div className="bg-rig-surface border border-rig-border rounded-xl overflow-hidden">
                {specs.map(([key, value], idx) => (
                  <div key={key} className={`flex px-6 py-4 ${idx !== specs.length - 1 ? 'border-b border-rig-border' : ''}`}>
                    <div className="w-1/3 text-rig-muted font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="w-2/3 text-rig-text font-medium">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
