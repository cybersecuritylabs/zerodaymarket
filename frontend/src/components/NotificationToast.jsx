import { useNotification } from '../context/NotificationContext';
import { X, CheckCircle, Gift, Tag, RotateCcw, Info } from 'lucide-react';

const TOAST_STYLES = {
  cashback_credited: {
    icon: Gift,
    borderColor: 'border-emerald-400',
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  },
  coupon_generated: {
    icon: Tag,
    borderColor: 'border-amber-400',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
  refund_processed: {
    icon: RotateCcw,
    borderColor: 'border-blue-400',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  default: {
    icon: Info,
    borderColor: 'border-brand-400',
    iconColor: 'text-brand-500',
    bgColor: 'bg-brand-50'
  }
};

export default function NotificationToast() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map(toast => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.default;
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`${style.bgColor} border-l-4 ${style.borderColor} rounded-lg shadow-lg p-4 animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
