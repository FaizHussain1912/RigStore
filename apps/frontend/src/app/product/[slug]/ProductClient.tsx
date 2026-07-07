'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext';
import { ShoppingCart, Heart, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { useCurrency } from '../../CurrencyContext';

interface ProductClientProps {
  slug: string;
}

export default function ProductClient({ slug }: ProductClientProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767'}/api/product/${slug}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // Removed the local addToWishlist function since we use the context now.

  if (loading) {
    return (
      <div className="container-dense pt-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-rig-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-dense pt-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-rig-text mb-4">Product Not Found</h1>
        <p className="text-rig-muted">{error}</p>
        <Link href="/" className="mt-8 text-rig-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const specs = product.specs ? Object.entries(product.specs) : [];
  const inStock = product.inventory && (product.inventory.totalStock - product.inventory.lockedStock > 0);

  return (
    <div className="container-dense pt-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-rig-muted mb-8">
        <Link href="/" className="hover:text-rig-text transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/category/${product.category?.slug}`} className="hover:text-rig-text transition-colors capitalize">
          {product.category?.name || 'Category'}
        </Link>
        <ChevronRight size={14} />
        <span className="text-rig-text truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="glass-panel rounded-2xl p-8 flex items-center justify-center min-h-[500px]">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full max-w-md h-auto object-contain transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col">
          <div className="mb-2 uppercase text-xs font-bold tracking-widest text-rig-primary">
            {product.brand}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-rig-text mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rig-border/50">
            <div className="text-3xl font-black text-rig-text">
              {formatPrice(product.basePrice)}
            </div>
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
              onClick={() => addToWishlist(product)}
              className="bg-rig-surface border border-rig-border hover:border-rig-primary text-rig-text font-bold px-6 py-4 rounded-xl flex items-center justify-center transition-colors group"
            >
              <Heart size={20} className="text-rig-muted group-hover:text-rig-primary transition-colors" />
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
