'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';

export default function CheckoutClient({ shippingRate = 0 }: { shippingRate?: number }) {
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Pakistan'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, JAZZCASH, NAYAPAY
  const [step, setStep] = useState<'DETAILS' | 'REVIEW'>('DETAILS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  const grandTotal = totalAmount + shippingRate;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (cart.length === 0 && !success) {
    return (
      <main className="container-dense py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-rig-muted">Your cart is empty.</p>
        <button onClick={() => router.push('/')} className="mt-6 bg-rig-primary px-6 py-2 rounded-lg text-white font-medium">Continue Shopping</button>
      </main>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('REVIEW');
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767'}/api/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process checkout');
      }

      await clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel max-w-md w-full p-12 text-center rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-3xl -z-10 rounded-full mix-blend-screen transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
          <p className="text-rig-muted mb-8">
            Thank you for shopping at RigStore. Your order has been successfully placed and is being processed.
          </p>
          
          <button 
            onClick={() => router.push('/orders')} 
            className="w-full bg-rig-primary text-white font-semibold py-3 rounded-lg hover:bg-rig-primary-dark transition-colors"
          >
            View My Orders
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container-dense py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="lg:w-2/3 space-y-6">
          {step === 'DETAILS' ? (
            <form id="checkout-form" onSubmit={handleReviewSubmit} className="space-y-6">
              {/* Shipping Info */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-rig-primary w-5 h-5" /> Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-rig-muted mb-1">Full Name</label>
                  <input required type="text" className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rig-muted mb-1">Email Address</label>
                  <input required type="email" className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors" value={shippingAddress.email} onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rig-muted mb-1">Phone Number</label>
                  <input required type="tel" className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} placeholder="0300 1234567" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-rig-muted mb-1">Street Address</label>
                  <input required type="text" className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} placeholder="House No, Street Area" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rig-muted mb-1">City</label>
                  <input required type="text" className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} placeholder="Karachi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rig-muted mb-1">ZIP Code</label>
                  <input required type="text" className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors" value={shippingAddress.zipCode} onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})} placeholder="74200" />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-rig-primary w-5 h-5" /> Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-rig-primary bg-rig-primary/10' : 'border-rig-border bg-rig-background hover:border-rig-muted'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 text-rig-primary bg-rig-surface border-rig-border focus:ring-rig-primary focus:ring-offset-rig-surface accent-rig-primary" />
                    <div>
                      <div className="font-semibold text-rig-text">Cash on Delivery (COD)</div>
                      <div className="text-sm text-rig-muted">Pay with cash upon delivery</div>
                    </div>
                  </div>
                </label>
                
                <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'JAZZCASH' ? 'border-rig-primary bg-rig-primary/10' : 'border-rig-border bg-rig-background hover:border-rig-muted'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="JAZZCASH" checked={paymentMethod === 'JAZZCASH'} onChange={() => setPaymentMethod('JAZZCASH')} className="w-5 h-5 text-rig-primary bg-rig-surface border-rig-border focus:ring-rig-primary focus:ring-offset-rig-surface accent-rig-primary" />
                    <div>
                      <div className="font-semibold text-rig-text">Jazzcash Transfer</div>
                      <div className="text-sm text-rig-muted">Transfer details will be provided soon</div>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'NAYAPAY' ? 'border-rig-primary bg-rig-primary/10' : 'border-rig-border bg-rig-background hover:border-rig-muted'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="NAYAPAY" checked={paymentMethod === 'NAYAPAY'} onChange={() => setPaymentMethod('NAYAPAY')} className="w-5 h-5 text-rig-primary bg-rig-surface border-rig-border focus:ring-rig-primary focus:ring-offset-rig-surface accent-rig-primary" />
                    <div>
                      <div className="font-semibold text-rig-text">NayaPay Transfer</div>
                      <div className="text-sm text-rig-muted">Transfer details will be provided soon</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </form>
          ) : (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rig-primary/5 blur-2xl -z-10 rounded-full"></div>
                <div className="flex justify-between items-center mb-6 border-b border-rig-border/50 pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-rig-text">
                    <CheckCircle2 className="text-rig-primary w-6 h-6" /> Review Your Details
                  </h2>
                  <button 
                    type="button"
                    onClick={() => setStep('DETAILS')}
                    className="text-sm text-rig-muted hover:text-rig-text transition-colors underline decoration-rig-muted hover:decoration-white"
                  >
                    Edit Details
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-rig-muted uppercase tracking-wider mb-2">Contact Info</h3>
                    <p className="text-rig-text font-medium text-lg">{shippingAddress.fullName}</p>
                    <p className="text-rig-muted">{shippingAddress.email}</p>
                    <p className="text-rig-muted">{shippingAddress.phone}</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-rig-muted uppercase tracking-wider mb-2">Shipping Address</h3>
                    <p className="text-rig-text leading-relaxed">{shippingAddress.address}</p>
                    <p className="text-rig-muted">{shippingAddress.city}, {shippingAddress.zipCode}</p>
                    <p className="text-rig-muted">{shippingAddress.country}</p>
                  </div>
                  <div className="md:col-span-2 pt-6 border-t border-rig-border/50">
                    <h3 className="text-xs font-bold text-rig-muted uppercase tracking-wider mb-3">Payment Method</h3>
                    <div className="bg-rig-surface border border-rig-border p-4 rounded-lg inline-flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-rig-primary" />
                      <span className="text-rig-text font-semibold">
                        {paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : paymentMethod === 'JAZZCASH' ? 'Jazzcash Transfer' : 'NayaPay Transfer'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="glass-panel p-6 rounded-xl sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                    <img src={item.image || '/images/gpu.png'} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-rig-text line-clamp-1 mb-1">{item.name}</div>
                    
                    {item.specs && Object.keys(item.specs).length > 0 && (
                      <div className="text-[10px] text-rig-muted mb-1 leading-tight line-clamp-2">
                        {Object.values(item.specs).slice(0, 4).map(v => String(v)).join(' • ')}
                      </div>
                    )}
                    
                    <div className="text-xs text-rig-muted">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-rig-text">
                    {formatPrice(item.basePrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-rig-border/50 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm text-rig-muted">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-rig-muted">
                <span>Shipping</span>
                <span>{shippingRate > 0 ? formatPrice(shippingRate) : 'Free'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-rig-text pt-2 border-t border-rig-border/50">
                <span>Total</span>
                <span className="text-rig-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {step === 'DETAILS' ? (
              <button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-rig-primary text-white font-semibold py-3.5 rounded-lg hover:bg-rig-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Order
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-rig-primary text-white font-semibold py-3.5 rounded-lg hover:bg-rig-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            )}
            {(paymentMethod === 'JAZZCASH' || paymentMethod === 'NAYAPAY') && (
              <p className="text-xs text-orange-400 text-center mt-2">Account details for {paymentMethod === 'JAZZCASH' ? 'Jazzcash' : 'NayaPay'} will be shared here soon.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
