import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Wallet, ArrowUpRight, ArrowDownRight, CreditCard,
  Gift, RotateCcw, DollarSign, Clock, Tag
} from 'lucide-react';

const TX_ICONS = {
  purchase: { icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50' },
  refund: { icon: RotateCcw, color: 'text-blue-500', bg: 'bg-blue-50' },
  cashback: { icon: Gift, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  signup_bonus: { icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
  system: { icon: DollarSign, color: 'text-gray-500', bg: 'bg-gray-50' }
};

export default function WalletPage() {
  const { walletBalance } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [activeTab, setActiveTab] = useState('transactions');

  const fetchData = useCallback(async () => {
    try {
      const [txRes, couponRes] = await Promise.all([
        api.get(`/wallet/transactions?page=${page}&limit=15`),
        api.get('/coupons')
      ]);
      setTransactions(txRes.data.transactions);
      setPagination(txRes.data.pagination);
      setCoupons(couponRes.data.coupons);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-brand-200">Available Balance</p>
            <p className="text-3xl font-bold">${Number(walletBalance).toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-brand-300">
          Your wallet is used for all purchases on ZeroDay Market
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'coupons'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Coupons ({coupons.length})
        </button>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No transactions yet</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-50">
                {transactions.map(tx => {
                  const txStyle = TX_ICONS[tx.referenceType] || TX_ICONS.system;
                  const Icon = txStyle.icon;
                  const isCredit = tx.type === 'credit';

                  return (
                    <div key={tx.id} className="px-6 py-4 flex items-center gap-4">
                      <div className={`w-10 h-10 ${txStyle.bg} rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${txStyle.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.createdAt || tx.created_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold flex items-center gap-0.5 ${
                          isCredit ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {isCredit ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                          {isCredit ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          bal: ${Number(tx.balanceAfter).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500 flex items-center px-3">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-3">
          {coupons.length === 0 ? (
            <div className="card text-center py-16">
              <Tag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No coupons yet</p>
              <p className="text-sm text-gray-400 mt-1">Buy a $30 product to earn a coupon!</p>
            </div>
          ) : (
            coupons.map(coupon => (
              <div key={coupon.id} className={`card p-5 ${coupon.isUsed ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      coupon.isUsed ? 'bg-gray-100' : 'bg-brand-100'
                    }`}>
                      <Tag className={`w-5 h-5 ${coupon.isUsed ? 'text-gray-400' : 'text-brand-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 font-mono">{coupon.code}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ${Number(coupon.discountAmount).toFixed(2)} discount
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      coupon.isUsed
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {coupon.isUsed ? 'Used' : 'Active'}
                    </span>
                    {coupon.expiresAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
