import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  ShoppingCart, RotateCcw, ArrowLeft, Package, CheckCircle,
  Zap, UsbIcon, Keyboard, Lamp, Headphones,
  Armchair, Monitor, ArrowUpDown, Tag
} from 'lucide-react';

const PRODUCT_ICONS = {
  'charging-pad': Zap,
  'usb-hub': UsbIcon,
  'keyboard': Keyboard,
  'desk-lamp': Lamp,
  'headphones': Headphones,
  'office-chair': Armchair,
  'monitor': Monitor,
  'standing-desk': ArrowUpDown
};

const PRODUCT_GRADIENTS = {
  'charging-pad': 'from-blue-400 to-blue-600',
  'usb-hub': 'from-emerald-400 to-emerald-600',
  'keyboard': 'from-violet-400 to-violet-600',
  'desk-lamp': 'from-amber-400 to-amber-600',
  'headphones': 'from-rose-400 to-rose-600',
  'office-chair': 'from-teal-400 to-teal-600',
  'monitor': 'from-indigo-400 to-indigo-600',
  'standing-desk': 'from-orange-400 to-orange-600'
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="h-80 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const Icon = PRODUCT_ICONS[product.imageKey] || Tag;
  const gradient = PRODUCT_GRADIENTS[product.imageKey] || 'from-gray-400 to-gray-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className={`relative h-80 md:h-96 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center`}>
          <Icon className="w-24 h-24 text-white/80" />

          {product.isRefundable && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              Refundable
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-brand-600 uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>In stock ({product.stock} available)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Wallet payment accepted</span>
            </div>
            {product.isRefundable && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Eligible for full refund</span>
              </div>
            )}
            {Number(product.price) === 30 && (
              <div className="flex items-center gap-2 text-sm text-brand-600 font-medium">
                <CheckCircle className="w-4 h-4 text-brand-500" />
                <span>Eligible for cashback + coupon offer</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`btn-primary flex-1 ${added ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
            >
              {added ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
