import { Gift, ArrowRight, Sparkles, DollarSign, Tag } from 'lucide-react';

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 rounded-2xl">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Buy any $30 product and get full cashback + exclusive $10 coupon!
            </h2>
            <p className="text-sm text-brand-200 max-w-2xl">
              Purchase any product priced at $30 and receive 100% cashback deposited directly to your wallet,
              plus an exclusive $10 discount coupon for your next purchase. No tricks, no catch — just our way
              of welcoming you.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex-shrink-0 hidden xl:block">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-300" />
                </div>
                <span>Full $30 cashback</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-amber-300" />
                </div>
                <span>Exclusive $10 coupon</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-sky-300" />
                </div>
                <span>Instant processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
