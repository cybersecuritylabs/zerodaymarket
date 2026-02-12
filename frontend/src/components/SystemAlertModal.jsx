import { useNotification } from '../context/NotificationContext';
import { Trophy, X, Shield } from 'lucide-react';

export default function SystemAlertModal() {
  const { systemAlert, dismissAlert } = useNotification();

  if (!systemAlert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismissAlert} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-in">
        {/* Top decoration */}
        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-8 pt-10 pb-14 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-amber-300" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[...Array(3)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="-mt-8 relative">
          <div className="mx-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {systemAlert.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {systemAlert.message}
            </p>
          </div>
        </div>

        <div className="px-8 pt-6 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-5">
            <Shield className="w-3.5 h-3.5" />
            <span>ZeroDay Market Security Lab</span>
          </div>
          <button
            onClick={dismissAlert}
            className="btn-primary w-full"
          >
            Continue
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={dismissAlert}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-modal-in {
          animation: modalIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
