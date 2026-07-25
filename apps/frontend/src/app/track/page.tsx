'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Package, CheckCircle2, Truck, Check, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { token } = useAuth(); // Auth is optional here
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`${API_URL}/api/orders/track/${orderId}`);
      if (!res.ok) {
        throw new Error('Order not found or invalid Order ID');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/track/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (!res.ok) {
        throw new Error('Failed to cancel order');
      }
      const updated = await res.json();
      setOrder(updated);
      setShowCancelModal(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);
  };

  const printInvoice = () => {
    if (!order) return;
    
    const itemsHtml = order.items.map((i: any) => `
      <tr>
        <td>
          <strong>${i.product.name}</strong><br/>
          <span style="font-size:10px; color:#666;">SKU: ${i.product.sku}</span>
        </td>
        <td class="center">${i.quantity}</td>
        <td class="right">${formatPrice(i.priceAtSale)}</td>
        <td class="right">${formatPrice(i.priceAtSale * i.quantity)}</td>
      </tr>
    `).join('');

    const itemsSubtotal = order.items.reduce((acc: number, item: any) => acc + (item.priceAtSale * item.quantity), 0);
    const shippingFee = order.totalAmount - itemsSubtotal;
    const name = order.guestName || order.user?.name || 'Customer';
    const email = order.guestEmail || order.user?.email || 'N/A';

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .brand-name { font-size: 32px; font-weight: bold; color: #000; margin: 0; }
            .brand-sub { font-size: 14px; color: #666; margin-top: 5px; }
            .qr-code { text-align: right; }
            .qr-code img { width: 100px; height: 100px; }
            .qr-text { font-size: 10px; color: #888; margin-top: 5px; }
            
            .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; letter-spacing: 2px; }
            
            .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .info-block { width: 45%; }
            .info-heading { font-size: 12px; font-weight: bold; color: #888; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-row { font-size: 14px; margin-bottom: 5px; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px 10px; border-bottom: 2px solid #ddd; font-size: 12px; color: #888; }
            td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .center { text-align: center; }
            .right { text-align: right; }
            
            .totals-section { display: flex; justify-content: space-between; margin-top: 30px; }
            .notes { width: 50%; font-size: 12px; color: #666; padding: 15px; background: #f9f9f9; border-radius: 4px; }
            .notes span { font-weight: bold; color: #333; }
            .totals { width: 40%; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .grand-total { display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; font-weight: bold; border-top: 2px solid #333; margin-top: 10px; }
            
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand-name">RigStore</h1>
              <p class="brand-sub">Karachi, Pakistan | Support: 0316-2975195</p>
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=RigStore-Order-${order.id}" alt="QR" />
              <div class="qr-text">Scan to Save Digital Copy</div>
            </div>
          </div>
          
          <div class="invoice-title">INVOICE / RECEIPT</div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-heading">ORDER INFO</div>
              <div class="info-row"><strong>Order ID:</strong> ${(order.id || '').toUpperCase().slice(0, 8)}</div>
              <div class="info-row"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
              <div class="info-row"><strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery'}</div>
            </div>
            <div class="info-block">
              <div class="info-heading">DELIVER TO</div>
              <div class="info-row"><strong>Name:</strong> ${name}</div>
              <div class="info-row"><strong>Email:</strong> ${email}</div>
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
            <div class="notes">Note: <span>Thank you for your order!</span></div>
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatPrice(itemsSubtotal)}</span>
              </div>
              <div class="total-row">
                <span>Shipping Fee:</span>
                <span>${formatPrice(shippingFee)}</span>
              </div>
              <div class="grand-total">
                <span>Grand Total:</span>
                <span>${formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <span>https://rigstore.com/</span>
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

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
    }
  };

  const getStatusInfo = (status: string, cancelRequested: boolean) => {
    if (cancelRequested) return { label: 'Cancellation Requested', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    switch(status) {
      case 'PENDING': return { label: 'Processing', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'SHIPPED': return { label: 'Shipped', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'DELIVERED': return { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/10' };
      case 'CANCELLED': return { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10' };
      default: return { label: status, color: 'text-rig-muted', bg: 'bg-rig-surface' };
    }
  };

  return (
    <main className="container-dense py-12 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
      <p className="text-rig-muted mb-8">Enter your Order ID to check its current status and details.</p>

      <div className="glass-panel p-6 rounded-2xl mb-8">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. A1B2C3D4"
            className="flex-1 bg-rig-background border border-rig-border rounded-xl px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary transition-colors font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-rig-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-rig-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Search className="w-5 h-5" /> Track</>}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>

      {order && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <div className="text-sm text-rig-muted mb-1">Order Details</div>
                <div className="text-xl font-bold font-mono text-rig-text">{(order.id || '').toUpperCase().slice(0, 8)}</div>
                <div className="text-sm text-rig-muted mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusInfo(order.status, order.cancelRequested).bg} ${getStatusInfo(order.status, order.cancelRequested).color}`}>
                  {getStatusInfo(order.status, order.cancelRequested).label}
                </span>
                <button
                  onClick={printInvoice}
                  className="bg-rig-surface border border-rig-border text-rig-text px-4 py-2 rounded-lg hover:bg-rig-background transition-colors text-sm font-medium"
                >
                  Print Invoice
                </button>
                {order.status === 'PENDING' && !order.cancelRequested && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4 border-b border-rig-border pb-2">Customer Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-rig-muted">Name:</span> {order.guestName || order.user?.name || 'Customer'}</p>
                  <p><span className="text-rig-muted">Email:</span> {order.guestEmail || order.user?.email || 'N/A'}</p>
                  <p><span className="text-rig-muted">Phone:</span> {order.phone || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4 border-b border-rig-border pb-2">Shipping Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-rig-muted">Address:</span> {order.address || 'N/A'}</p>
                  <p><span className="text-rig-muted">Payment:</span> {order.paymentMethod}</p>
                </div>
              </div>
            </div>

            <h3 className="font-bold mb-4 border-b border-rig-border pb-2">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 bg-rig-background p-4 rounded-xl border border-rig-border/50">
                  <div className="w-16 h-16 bg-white rounded-lg p-1">
                    <img src={item.product.imageUrl || '/images/gpu.png'} className="w-full h-full object-contain" alt={item.product.name} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{item.product.name}</div>
                    <div className="text-sm text-rig-muted">Qty: {item.quantity} × {formatPrice(item.priceAtSale)}</div>
                  </div>
                  <div className="font-bold">
                    {formatPrice(item.priceAtSale * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                <div className="flex justify-between text-rig-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.items.reduce((acc: number, item: any) => acc + (item.priceAtSale * item.quantity), 0))}</span>
                </div>
                <div className="flex justify-between text-rig-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(order.totalAmount - order.items.reduce((acc: number, item: any) => acc + (item.priceAtSale * item.quantity), 0))}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-rig-border text-rig-primary">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-rig-surface max-w-md w-full rounded-2xl p-6 border border-rig-border shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Cancel Order</h3>
            <p className="text-rig-muted text-sm mb-6">Are you sure you want to request cancellation for this order? This action cannot be undone.</p>
            
            <textarea
              className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-3 text-rig-text focus:outline-none focus:border-red-500 transition-colors mb-6 resize-none"
              placeholder="Reason for cancellation (optional)"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            ></textarea>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2.5 rounded-lg text-rig-muted hover:text-rig-text hover:bg-rig-background transition-colors"
                disabled={cancelLoading}
              >
                Keep Order
              </button>
              <button 
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {cancelLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
