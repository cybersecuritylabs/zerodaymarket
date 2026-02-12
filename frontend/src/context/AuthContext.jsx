import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('zdm_token');
  const isAuthenticated = !!user;

  // Fetch user profile and wallet balance
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setWalletBalance(data.user.walletBalance || 0);
    } catch {
      localStorage.removeItem('zdm_token');
      setUser(null);
      setWalletBalance(0);
    }
  }, []);

  // Refresh wallet balance
  const refreshBalance = useCallback(async () => {
    try {
      const { data } = await api.get('/wallet/balance');
      setWalletBalance(data.balance);
    } catch {
      // Silently fail — balance will update on next poll
    }
  }, []);

  // On mount, verify existing token
  useEffect(() => {
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll wallet balance every 5 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(refreshBalance, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshBalance]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('zdm_token', data.token);
    setUser(data.user);
    await refreshBalance();
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('zdm_token', data.token);
    setUser(data.user);
    setWalletBalance(50.00);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('zdm_token');
    setUser(null);
    setWalletBalance(0);
  };

  return (
    <AuthContext.Provider value={{
      user, walletBalance, loading, isAuthenticated,
      login, register, logout, refreshBalance, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
