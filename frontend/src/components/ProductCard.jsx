import { Link } from 'react-router-dom';
import { ShoppingCart, RotateCcw, Tag } from 'lucide-react';
import {
  Zap, UsbIcon, Keyboard, Lamp, Headphones,
  Armchair, Monitor, ArrowUpDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const Icon = PRODUCT_ICONS[product.imageKey] || Tag;
  const gradient = PRODUCT_GRADIENTS[product.imageKey] || 'from-gray-400 to-gray-600';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addItem(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="card group hover:shadow-md transition-shadow duration-200">
      {/* Product Image Area */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-200" />

        {/* Refundable Badge */}
        {product.isRefundable && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Refundable
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-sm font-bold text-gray-900 px-3 py-1 rounded-full">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
