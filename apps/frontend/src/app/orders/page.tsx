'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useCurrency } from '../CurrencyContext';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <main className="container-dense py-12">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-rig-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container-dense py-12">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center justify-center">
          <Package className="w-16 h-16 text-rig-muted mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign in to view orders</h2>
          <p className="text-rig-muted mb-6">You need to be logged in to view your order history.</p>
          <Link href="/login" className="bg-rig-primary text-white px-6 py-3 rounded-lg hover:bg-rig-primary-dark transition-colors font-semibold">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'PROCESSING': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'SHIPPED': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'DELIVERED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-rig-muted bg-rig-surface border-rig-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <main className="container-dense py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Package className="text-rig-primary" /> My Orders
      </h1>
      
      {orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <Package className="w-16 h-16 text-rig-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-rig-muted mb-6">Looks like you haven't placed any orders yet.</p>
          <Link href="/" className="bg-rig-primary text-white px-6 py-3 rounded-lg hover:bg-rig-primary-dark transition-colors font-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-panel rounded-2xl overflow-hidden border border-rig-border">
              {/* Order Header */}
              <div className="bg-rig-surface p-6 border-b border-rig-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="text-xs font-semibold text-rig-muted uppercase tracking-wider mb-1">Order Placed</div>
                    <div className="text-rig-text">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</div>
                  </div>
                  <div>
                    <div className="text-rig-muted text-sm uppercase tracking-wider mb-1">Total Amount</div>
                    <div className="text-rig-text font-bold">{formatPrice(order.totalAmount)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-rig-muted uppercase tracking-wider mb-1">Order ID</div>
                    <div className="text-rig-text font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}...</div>
                  </div>
                </div>
                
                <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b border-rig-border/50 last:border-0 last:pb-0">
                      <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 p-2">
                        <img src={item.product.imageUrl || '/images/gpu.png'} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-grow">
                        <Link href={`/product/${item.product.slug}`} className="text-lg font-bold text-rig-text hover:text-rig-primary transition-colors line-clamp-1">
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-rig-muted mb-1">{item.product.brand}</div>
                        <div className="flex items-center gap-4 text-sm text-rig-muted">
                          <span>Qty: {item.quantity}</span>
                          <span>Price: {formatPrice(item.priceAtSale * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
