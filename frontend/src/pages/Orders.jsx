import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Package, RotateCcw, AlertCircle, CheckCircle, Clock,
  Tag, DollarSign
} from 'lucide-react';

export default function Orders() {
  const { refreshBalance } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(null);
  const [refundResult, setRefundResult] = useState(null);
  const [refundError, setRefundError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefund = async (orderId) => {
    setRefundError('');
    setRefundResult(null);
    setRefunding(orderId);

    try {
      const { data } = await api.post(`/refunds/${orderId}`);
      setRefundResult(data);
      await refreshBalance();
      await fetchOrders();
    } catch (err) {
      setRefundError(err.response?.data?.error || 'Refund failed');
    } finally {
      setRefunding(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Refund Result */}
      {refundResult && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm p-4 rounded-lg mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{refundResult.message}</span>
          <button onClick={() => setRefundResult(null)} className="ml-auto text-emerald-500 hover:text-emerald-700 text-xs font-medium">
            Dismiss
          </button>
        </div>
      )}

      {refundError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{refundError}</span>
          <button onClick={() => setRefundError('')} className="ml-auto text-red-500 hover:text-red-700 text-xs font-medium">
            Dismiss
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1">Your purchase history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isRefundable = order.product?.isRefundable && order.status === 'completed';
            const isRefunded = order.status === 'refunded';

            return (
              <div key={order.id} className="card">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      isRefunded
                        ? 'bg-gray-100'
                        : 'bg-gradient-to-br from-brand-400 to-brand-600'
                    }`}>
                      <Package className={`w-6 h-6 ${isRefunded ? 'text-gray-400' : 'text-white/80'}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {order.product?.name || 'Unknown Product'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt || order.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Paid: ${Number(order.amountPaid).toFixed(2)}
                        </span>
                        {order.coupon && (
                          <span className="flex items-center gap-1 text-brand-600">
                            <Tag className="w-3 h-3" />
                            {order.coupon.code}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3 sm:ml-auto">
                    {/* Original Price vs Paid */}
                    {Number(order.discountApplied) > 0 && (
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400 line-through">${Number(order.originalPrice).toFixed(2)}</p>
                        <p className="text-sm font-semibold text-gray-900">${Number(order.amountPaid).toFixed(2)}</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      isRefunded
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {isRefunded ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          Refunded
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </>
                      )}
                    </span>

                    {/* Refund Button */}
                    {isRefundable && (
                      <button
                        onClick={() => handleRefund(order.id)}
                        disabled={refunding === order.id}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        {refunding === order.id ? (
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-700" />
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Request Refund
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Discount details */}
                {Number(order.discountApplied) > 0 && (
                  <div className="px-5 pb-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-gray-600">
                      <Tag className="w-3 h-3 text-brand-500" />
                      <span>Coupon discount: -${Number(order.discountApplied).toFixed(2)}</span>
                      <span className="text-gray-300">|</span>
                      <span>Original price: ${Number(order.originalPrice).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
