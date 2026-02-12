import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Shield, Users, Package, DollarSign, RotateCcw,
  TrendingUp, Tag, Settings, LogIn, Lock,
  BarChart3, AlertTriangle, Eye, EyeOff, Mail,
  Search, ChevronDown, Upload
} from 'lucide-react';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.user.role !== 'admin') {
        setError('Access denied. Administrator credentials required.');
        return;
      }
      localStorage.setItem('zdm_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Internal Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Restricted access — authorized personnel only</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@zerodaymarket.io"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Authenticate
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          All access attempts are logged and monitored
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promotions, setPromo] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Check if user is a logged-in admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      setAdmin(user);
    }
  }, [user]);

  // Fetch admin panel data
  useEffect(() => {
    if (!admin) return;

    async function fetchAdminData() {
      try {
        const [statsRes, usersRes, ordersRes, promoRes] = await Promise.all([
          api.get('/internal-admin-dashboard/stats'),
          api.get('/internal-admin-dashboard/users'),
          api.get('/internal-admin-dashboard/orders'),
          api.get('/internal-admin-dashboard/promotions')
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
        setOrders(ordersRes.data.orders);
        setPromo(promoRes.data.promotions);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          setAdmin(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [admin]);

  if (!admin) {
    return <AdminLogin onLogin={(u) => setAdmin(u)} />;
  }

  const sections = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'refunds', label: 'Refunds', icon: RotateCcw },
    { key: 'promotions', label: 'Promotions', icon: Tag },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">ZeroDay Market Admin</h1>
              <p className="text-xs text-gray-500">Internal Control Panel</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            Logged in as {admin.email}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation */}
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
          {sections.map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  activeSection === sec.key
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 h-32" />
            ))}
          </div>
        ) : (
          <>
            {/* Overview Section */}
            {activeSection === 'overview' && stats && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-emerald-400' },
                    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-amber-400' },
                    { label: 'Refunds', value: stats.refundedOrders, icon: RotateCcw, color: 'text-red-400' }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400">{stat.label}</span>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Order Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Completed</span>
                        <span className="text-emerald-400">{stats.completedOrders}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-emerald-500 rounded-full h-2"
                          style={{ width: `${stats.totalOrders ? (stats.completedOrders / stats.totalOrders * 100) : 0}%` }} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Refunded</span>
                        <span className="text-red-400">{stats.refundedOrders}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 rounded-full h-2"
                          style={{ width: `${stats.totalOrders ? (stats.refundedOrders / stats.totalOrders * 100) : 0}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Financial Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Revenue</span>
                        <span className="text-emerald-400 font-medium">${stats.revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Refunds</span>
                        <span className="text-red-400 font-medium">${stats.totalRefunds.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
                        <span className="text-gray-400">Net Revenue</span>
                        <span className="text-white font-bold">${(stats.revenue - stats.totalRefunds).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Active Coupons</span>
                        <span className="text-amber-400">{stats.activeCoupons}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Section */}
            {activeSection === 'users' && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-300">Registered Users</h3>
                  <span className="text-xs text-gray-500">{users.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase">
                        <th className="px-5 py-3 text-left">Name</th>
                        <th className="px-5 py-3 text-left">Email</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-right">Balance</th>
                        <th className="px-5 py-3 text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-700/30">
                          <td className="px-5 py-3 text-gray-300">{u.name}</td>
                          <td className="px-5 py-3 text-gray-400">{u.email}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              u.role === 'admin' ? 'bg-red-900/50 text-red-400' : 'bg-gray-700 text-gray-300'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right text-gray-300">
                            ${Number(u.wallet?.balance || 0).toFixed(2)}
                          </td>
                          <td className="px-5 py-3 text-right text-gray-500 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Section */}
            {activeSection === 'orders' && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300">All Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase">
                        <th className="px-5 py-3 text-left">Customer</th>
                        <th className="px-5 py-3 text-left">Product</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                        <th className="px-5 py-3 text-center">Status</th>
                        <th className="px-5 py-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-700/30">
                          <td className="px-5 py-3 text-gray-300">{o.user?.name || 'N/A'}</td>
                          <td className="px-5 py-3 text-gray-400">{o.product?.name || 'N/A'}</td>
                          <td className="px-5 py-3 text-right text-gray-300">${Number(o.amountPaid).toFixed(2)}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              o.status === 'refunded' ? 'bg-red-900/50 text-red-400' : 'bg-emerald-900/50 text-emerald-400'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right text-gray-500 text-xs">
                            {new Date(o.created_at || o.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Refunds Section */}
            {activeSection === 'refunds' && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Refund History</h3>
                {orders.filter(o => o.status === 'refunded').length === 0 ? (
                  <div className="text-center py-10">
                    <RotateCcw className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No refunds processed yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'refunded').map(o => (
                      <div key={o.id} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">{o.product?.name}</p>
                          <p className="text-xs text-gray-500">{o.user?.email}</p>
                        </div>
                        <span className="text-sm font-semibold text-red-400">
                          ${Number(o.product?.price || o.amountPaid).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Promotions Section */}
            {activeSection === 'promotions' && promotions && (
              <div className="space-y-4">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Active Promotion</h3>
                  <div className="bg-brand-900/30 border border-brand-800 rounded-lg p-4">
                    <p className="text-sm text-brand-300">{promotions.activeOffer}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                    <span className="text-xs text-gray-500">Coupons Issued</span>
                    <p className="text-xl font-bold mt-1">{promotions.totalCouponsIssued}</p>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                    <span className="text-xs text-gray-500">Coupons Used</span>
                    <p className="text-xl font-bold mt-1">{promotions.couponsUsed}</p>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                    <span className="text-xs text-gray-500">Cashback Distributed</span>
                    <p className="text-xl font-bold mt-1">${promotions.totalCashbackIssued.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Site Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Site Name</label>
                    <input
                      type="text"
                      defaultValue="ZeroDay Market"
                      className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Theme Color</label>
                    <input
                      type="text"
                      defaultValue="#4F46E5"
                      className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Logo Upload</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 transition-colors">
                      <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-600 mt-1">PNG, JPG, SVG up to 2MB</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-gray-300">Maintenance Mode</p>
                      <p className="text-xs text-gray-500">Take the site offline for maintenance</p>
                    </div>
                    <div className="w-10 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-gray-500 rounded-full absolute left-1 top-1" />
                    </div>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
