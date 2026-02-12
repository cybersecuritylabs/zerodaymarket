import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  CreditCard, Tag, Wallet, AlertCircle, CheckCircle,
  ShoppingCart, ArrowLeft, Package
} from 'lucide-react';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { walletBalance, refreshBalance } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotal();
  const discount = couponApplied ? couponApplied.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponApplied(null);
    setValidating(true);

    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode.trim() });
      if (data.valid) {
        setCouponApplied(data.coupon);
      }
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Invalid coupon code');
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      if (couponApplied) {
        payload.couponCode = couponApplied.code;
      }

      await api.post('/orders/checkout', payload);

      clearCart();
      await refreshBalance();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500">Review and place your order</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items & Coupon */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Order Items
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(item => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-white/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4" />
              Apply Coupon
            </h2>

            {couponApplied ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {couponApplied.code} — ${couponApplied.discountAmount.toFixed(2)} off
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter coupon code"
                    className="input-field flex-1"
                    maxLength={50}
                  />
                  <button
                    onClick={handleValidateCoupon}
                    disabled={validating || !couponCode.trim()}
                    className="btn-secondary shrink-0"
                  >
                    {validating ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {couponError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm mb-1">
                <Wallet className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Wallet Balance</span>
              </div>
              <span className={`text-lg font-bold ${walletBalance >= grandTotal ? 'text-emerald-600' : 'text-red-600'}`}>
                ${Number(walletBalance).toFixed(2)}
              </span>
              {walletBalance >= grandTotal && (
                <p className="text-xs text-emerald-600 mt-1">
                  Remaining after purchase: ${(walletBalance - grandTotal).toFixed(2)}
                </p>
              )}
              {walletBalance < grandTotal && (
                <p className="text-xs text-red-500 mt-1">Insufficient balance</p>
              )}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || walletBalance < grandTotal}
              className="btn-primary w-full mt-5"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ${grandTotal.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
