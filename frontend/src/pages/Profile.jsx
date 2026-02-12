import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Shield, Calendar, Wallet, Trophy, Clock
} from 'lucide-react';

export default function Profile() {
  const { user, walletBalance } = useAuth();

  if (!user) return null;

  const hasAchievement = user.achievements && user.achievements.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500">Your account information</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Email</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Role</span>
              </div>
              <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Member Since</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Wallet Balance</span>
              </div>
              <p className="text-sm font-medium text-gray-900">${Number(walletBalance).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {hasAchievement && (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              Achievements
            </h3>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Lab Solved</h4>
                  <p className="text-xs text-gray-600">
                    Successfully identified and exploited a critical business logic vulnerability.
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    Completed: {new Date(user.achievements[0].completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
