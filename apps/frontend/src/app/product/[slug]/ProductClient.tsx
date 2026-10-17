'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext';
import { useCompare } from '../../CompareContext';
import { useCurrency } from '../../CurrencyContext';
import { useToast } from '../../ToastContext';
import { useAuth } from '../../AuthContext';
import ProductCard from '../../../components/ProductCard';
import { 
  ShoppingCart, Heart, ShieldCheck, Truck, ChevronRight, 
  ArrowLeftRight, Star, Plus, Minus, MessageSquare, Check, User
} from 'lucide-react';

interface ProductClientProps {
  slug: string;
  initialProduct: any;
}

export default function ProductClient({ slug, initialProduct }: ProductClientProps) {
  const [product, setProduct] = useState<any>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const { user } = useAuth();

  // Reviews state
  const [reviewsData, setReviewsData] = useState<{ reviews: any[], total: number, avgRating: number }>({
    reviews: [],
    total: 0,
    avgRating: 5
  });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setReviewerName(user?.name || '');
      
      // Fetch reviews
      fetch(`${API_URL}/api/reviews/product/${initialProduct.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.reviews) setReviewsData(data);
        })
        .catch(console.error);

      // Fetch related products
      if (initialProduct.category?.slug) {
        fetch(`${API_URL}/api/category/${initialProduct.category.slug}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setRelatedProducts(data.filter(p => p.id !== initialProduct.id).slice(0, 4));
            }
          })
          .catch(console.error);
      }
    }
  }, [initialProduct, API_URL, user]);

  if (!product) {
    return (
      <div className="container-dense pt-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-rig-text mb-4">Product Not Found</h1>
        <p className="text-rig-muted">We could not find this product.</p>
        <Link href="/" className="mt-8 text-rig-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const inStock = product.inventory ? (product.inventory.totalStock > 0) : true;
  const specs = Object.entries(product.specs || {}).filter(([k, v]) => v);
  const isWishlisted = wishlistItems.some(item => item.product.id === product.id);
  const isCompared = isInCompare(product.id);

  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100) 
    : 0;

  const handleAddMultipleToCart = () => {
    addToCart(product, quantity);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast('Please write a review comment', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews/product/${product.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewerName.trim() || user?.name || 'Customer',
          rating: reviewRating,
          comment: reviewComment.trim(),
          userId: user?.id || null
        })
      });

      if (res.ok) {
        toast('Review submitted! Thank you for your feedback.', 'success');
        setReviewComment('');
        setShowReviewForm(false);
        // Refresh reviews
        const refresh = await fetch(`${API_URL}/api/reviews/product/${product.id}`);
        if (refresh.ok) setReviewsData(await refresh.json());
      } else {
        const err = await res.json().catch(() => null);
        toast(err?.error || 'Failed to submit review', 'error');
      }
    } catch (e) {
      toast('Network error. Please try again.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container-dense py-8 lg:py-16 animate-in fade-in duration-500">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-rig-muted mb-8 font-medium">
        <Link href="/" className="hover:text-rig-text transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/category/${product.category?.slug}`} className="hover:text-rig-text transition-colors">{product.category?.name}</Link>
        <ChevronRight size={12} />
        <span className="text-rig-text font-bold truncate max-w-sm">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
        
        {/* Left: Image Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-square bg-rig-surface border border-rig-border rounded-2xl flex items-center justify-center p-8 relative overflow-hidden group">
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wider">
                -{discountPercent}% OFF
              </div>
            )}
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105" />
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
            <span>{product.brand}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rig-primary"></span>
            <span className="text-rig-muted">{product.category?.name}</span>
          </div>
          
          <h1 className="text-2xl lg:text-4xl font-black text-rig-text mb-3 leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Rating Summary Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rig-border/60">
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  className={star <= Math.round(reviewsData.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-rig-muted/40'} 
                />
              ))}
            </div>
            <span className="text-xs font-bold text-rig-text">{reviewsData.avgRating} / 5</span>
            <span className="text-xs text-rig-muted">({reviewsData.total} {reviewsData.total === 1 ? 'review' : 'reviews'})</span>
          </div>
          
          {/* Price & Stock */}
          <div className="flex items-baseline gap-4 mb-6">
            <div className="text-3xl lg:text-4xl font-black text-rig-primary">
              {formatPrice(product.basePrice)}
            </div>
            {hasDiscount && (
              <div className="text-lg text-rig-muted line-through font-medium">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ml-auto ${inStock ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </div>
          </div>

          <p className="mb-8 text-rig-muted leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Quantity Picker */}
            <div className="flex items-center bg-rig-surface border border-rig-border rounded-xl px-2 py-1 shrink-0 justify-between sm:justify-start">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-rig-muted hover:text-rig-text transition-colors disabled:opacity-40"
                disabled={!inStock || quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-bold text-rig-text text-sm min-w-[2rem] text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-rig-muted hover:text-rig-text transition-colors disabled:opacity-40"
                disabled={!inStock}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={handleAddMultipleToCart}
              disabled={!inStock}
              className="flex-1 bg-rig-primary hover:bg-rose-500 disabled:bg-rig-border disabled:text-rig-muted text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rig-primary/20 text-sm"
            >
              <ShoppingCart size={18} />
              {inStock ? `Add to Cart (${quantity})` : 'Out of Stock'}
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
              className="bg-rig-surface border border-rig-border hover:border-rig-primary text-rig-text font-bold px-4 py-3.5 rounded-xl flex items-center justify-center transition-colors group"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} className={`transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-rig-muted group-hover:text-rig-primary'}`} />
            </button>

            {/* Compare Button */}
            <button 
              onClick={() => isCompared ? removeFromCompare(product.id) : addToCompare(product)}
              className={`border font-bold px-4 py-3.5 rounded-xl flex items-center justify-center transition-colors ${isCompared ? 'bg-rig-primary text-white border-rig-primary' : 'bg-rig-surface border-rig-border hover:border-rig-primary text-rig-muted hover:text-rig-text'}`}
              title={isCompared ? "Remove from compare" : "Add to compare"}
            >
              {isCompared ? <Check size={20} /> : <ArrowLeftRight size={20} />}
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rig-surface border border-rig-border">
              <Truck className="text-rig-primary w-5 h-5 shrink-0" />
              <div className="text-xs font-semibold text-rig-text">Nationwide Delivery<br/><span className="text-[11px] text-rig-muted font-normal">Cash on delivery available</span></div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rig-surface border border-rig-border">
              <ShieldCheck className="text-rig-primary w-5 h-5 shrink-0" />
              <div className="text-xs font-semibold text-rig-text">7 Days Checking Warranty<br/><span className="text-[11px] text-rig-muted font-normal">Official serial verification</span></div>
            </div>
          </div>

          {/* Specifications Table */}
          {specs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-rig-text mb-3">Hardware Specifications</h3>
              <div className="bg-rig-surface border border-rig-border rounded-xl overflow-hidden text-xs">
                {specs.map(([key, value], idx) => (
                  <div key={key} className={`flex px-4 py-3 ${idx !== specs.length - 1 ? 'border-b border-rig-border' : ''}`}>
                    <div className="w-1/3 text-rig-muted font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="w-2/3 text-rig-text font-semibold">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <section className="mb-20 border-t border-rig-border pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-rig-text tracking-tight">Customer Reviews</h2>
            <p className="text-xs text-rig-muted mt-1">Verified purchaser feedback and ratings</p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-rig-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-rig-primary/90 transition-colors flex items-center gap-2"
          >
            <MessageSquare size={14} /> Write a Review
          </button>
        </div>

        {/* Review Form Modal/Drawer */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-rig-surface border border-rig-border p-6 rounded-2xl mb-8 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-base text-rig-text">Share your thoughts on {product.name}</h3>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-rig-muted">Rating:</span>
              <div className="flex gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setReviewRating(s)}
                    className="focus:outline-none"
                  >
                    <Star size={20} className={s <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-rig-muted/40'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-rig-muted block mb-1">Your Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Asad Gaming"
                className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-2 text-xs text-rig-text focus:outline-none focus:border-rig-primary"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-rig-muted block mb-1">Your Review</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the performance, temperature, and packaging?"
                className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-2.5 text-xs text-rig-text focus:outline-none focus:border-rig-primary resize-y"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="text-xs font-semibold px-4 py-2 text-rig-muted hover:text-rig-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-rig-primary hover:bg-rig-primary/90 text-white text-xs font-bold px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviewsData.reviews.length === 0 ? (
          <div className="text-center py-12 bg-rig-surface/50 border border-dashed border-rig-border rounded-2xl">
            <Star size={28} className="text-rig-muted/50 mx-auto mb-2" />
            <p className="text-sm font-bold text-rig-text">No reviews yet for this product</p>
            <p className="text-xs text-rig-muted mt-1">Be the first to review this component and help fellow gamers!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviewsData.reviews.map((rev: any) => (
              <div key={rev.id} className="bg-rig-surface border border-rig-border p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rig-primary/10 text-rig-primary flex items-center justify-center font-bold text-xs">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-bold text-rig-text">{rev.userName}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-rig-muted/40'} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-rig-muted leading-relaxed">{rev.comment}</p>
                <div className="text-[10px] text-rig-muted/70 pt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Hardware Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-rig-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-rig-text tracking-tight">Similar Hardware</h2>
              <p className="text-xs text-rig-muted mt-1">Customers also viewed these components</p>
            </div>
            <Link href={`/category/${product.category?.slug}`} className="text-xs font-bold text-rig-primary hover:underline flex items-center">
              View all {product.category?.name} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
