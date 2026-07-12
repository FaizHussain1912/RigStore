'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Package, Clock, CheckCircle2, XCircle, Printer, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useCurrency } from '../CurrencyContext';
import { useToast } from '../ToastContext';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

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

  const openCancelModal = (orderId: string) => {
    setCancellingOrderId(orderId);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleCancelSubmit = async () => {
    if (!cancellingOrderId || !token) return;
    setIsSubmittingCancel(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${cancellingOrderId}/cancel-request`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (res.ok) {
        // Update local state
        setOrders(orders.map(o => o.id === cancellingOrderId ? { ...o, cancelRequested: true, cancelReason } : o));
        setCancelModalOpen(false);
        toast({ title: 'Request Submitted', description: 'Your cancellation request has been sent to the team.' });
      } else {
        const errorData = await res.json().catch(() => null);
        toast({ title: 'Request Failed', description: errorData?.error || 'Failed to request cancellation', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handlePrintOrder = (order: any) => {
    const itemsHtml = order.items?.map((item: any) => `
      <tr>
        <td>${item.product.name}</td>
        <td class="center">${item.quantity}</td>
        <td class="right">Rs ${(item.priceAtSale || item.product.basePrice || 0).toLocaleString()}</td>
        <td class="right bold">Rs ${((item.priceAtSale || item.product.basePrice || 0) * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('') || '';

    const itemsSubtotal = order.items.reduce((sum: number, item: any) => sum + ((item.priceAtSale || item.product?.basePrice || 0) * item.quantity), 0);
    const shippingFee = order.totalAmount - itemsSubtotal;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            @page { margin: 0; size: A4; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0; padding: 50px 60px; color: #333; font-size: 13px;
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
            .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
            .brand svg { width: 32px; height: 32px; color: #f97316; }
            .brand-text { font-size: 26px; font-weight: 800; color: #ef4444; margin: 0; letter-spacing: -0.5px; }
            .brand-sub { font-size: 11px; color: #64748b; margin: 0; }
            
            .qr-code { text-align: center; }
            .qr-code img { width: 80px; height: 80px; }
            .qr-text { font-size: 9px; color: #64748b; margin-top: 4px; font-weight: 500; }

            .invoice-title { font-size: 14px; font-weight: 800; color: #475569; letter-spacing: 1px; margin-bottom: 40px; }
            
            .info-section { display: flex; justify-content: space-between; margin-bottom: 50px; }
            .info-block { width: 45%; }
            .info-heading { font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 12px; }
            .info-row { margin-bottom: 8px; color: #475569; font-size: 12px; }
            .info-row strong { color: #0f172a; font-weight: 600; width: 120px; display: inline-block; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px 8px; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; font-size: 11px; font-weight: 800; color: #475569; }
            th.center { text-align: center; }
            th.right, td.right { text-align: right; }
            td { padding: 16px 8px; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #334155; font-weight: 600; }
            td.bold { font-weight: 800; color: #0f172a; }

            .totals-section { display: flex; justify-content: space-between; margin-top: 20px; }
            .notes { width: 50%; font-size: 12px; color: #0f172a; font-weight: 700; }
            .notes span { color: #64748b; font-weight: 600; }
            .totals { width: 40%; }
            .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 40px; color: #64748b; font-size: 13px; font-weight: 500; }
            .total-row span:last-child { color: #475569; min-width: 80px; text-align: right; }
            .grand-total { font-weight: 800; font-size: 15px; color: #0f172a; margin-top: 20px; padding-top: 15px; display: flex; justify-content: flex-end; gap: 40px; }
            .grand-total span:last-child { color: #ef4444; min-width: 80px; text-align: right; }

            .footer { position: fixed; bottom: 40px; left: 60px; right: 60px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <h1 class="brand-text">RigStore</h1>
              </div>
              <p class="brand-sub">Karachi, Pakistan | Support: 0316-2975195</p>
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=RigStore-Order-${order.id}" alt="QR" />
              <div class="qr-text">Scan to Save Digital Copy</div>
            </div>
          </div>
          
          <div class="invoice-title">PACKING / INVOICE SLIP</div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-heading">ORDER INFO</div>
              <div class="info-row"><strong>Order ID:</strong> ${(order.id || '').toUpperCase().slice(0, 8)}</div>
              <div class="info-row"><strong>Date:</strong> ${format(new Date(order.createdAt), 'MMMM d, yyyy')}</div>
              <div class="info-row"><strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery'}</div>
            </div>
            <div class="info-block">
              <div class="info-heading">DELIVER TO</div>
              <div class="info-row"><strong>Name:</strong> ${user?.name || 'Customer'}</div>
              <div class="info-row"><strong>Phone:</strong> ${order.phone || 'N/A'}</div>
              <div class="info-row"><strong>Address:</strong> ${order.address || 'N/A'}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th class="center">QTY</th>
                <th class="right">PRICE</th>
                <th class="right">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="notes">Note: <span>${order.note || 'order'}</span></div>
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>Rs ${itemsSubtotal.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Shipping Fee:</span>
                <span>Rs ${shippingFee.toLocaleString()}</span>
              </div>
              <div class="grand-total">
                <span>Grand Total:</span>
                <span>Rs ${order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <span>https://rigstore.com</span>
            <span>1/1</span>
          </div>

          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
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
                
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                  {order.cancelRequested && order.status !== 'CANCELLED' && (
                    <div className="px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-500 flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="w-4 h-4" />
                      Cancellation Requested
                    </div>
                  )}
                  {order.status === 'PENDING' && !order.cancelRequested && (
                    <button 
                      onClick={() => openCancelModal(order.id)}
                      className="px-3 py-1.5 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Order
                    </button>
                  )}
                  <button 
                    onClick={() => handlePrintOrder(order)}
                    className="p-1.5 rounded-full bg-rig-surface border border-rig-border text-rig-muted hover:text-rig-text hover:bg-rig-background transition-colors"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
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

      {/* Cancel Request Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-rig-surface border border-rig-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-rig-border">
              <h3 className="text-xl font-bold flex items-center gap-2 text-red-500">
                <AlertTriangle /> Cancel Order
              </h3>
            </div>
            <div className="p-6">
              <p className="text-rig-muted mb-4">
                Please provide a reason for cancelling this order. Our team will review your request.
              </p>
              <textarea
                className="w-full bg-rig-background border border-rig-border rounded-lg p-3 text-rig-text focus:outline-none focus:border-rig-primary h-24 resize-none"
                placeholder="Reason for cancellation (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="p-6 bg-rig-background border-t border-rig-border flex justify-end gap-3">
              <button 
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-lg font-semibold text-rig-muted hover:text-rig-text transition-colors"
                disabled={isSubmittingCancel}
              >
                Go Back
              </button>
              <button 
                onClick={handleCancelSubmit}
                className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                disabled={isSubmittingCancel}
              >
                {isSubmittingCancel ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : null}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
