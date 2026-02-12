import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [systemAlert, setSystemAlert] = useState(null);
  const [lastCheckId, setLastCheckId] = useState(null);

  // Add a toast message
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Dismiss the system alert
  const dismissAlert = useCallback(async () => {
    if (systemAlert) {
      try {
        await api.patch(`/notifications/${systemAlert.id}/read`);
      } catch { /* ignore */ }
    }
    setSystemAlert(null);
  }, [systemAlert]);

  // Poll for new notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const pollNotifications = async () => {
      try {
        const { data } = await api.get('/notifications/unread');
        const notifications = data.notifications || [];

        for (const notif of notifications) {
          // Handle system alerts (rendered as a modal)
          if (notif.type === 'system_alert' && !notif.isRead) {
            setSystemAlert(notif);
            continue;
          }

          // Show toast for new notifications we haven't seen
          if (notif.id !== lastCheckId && !notif.isRead) {
            addToast({
              type: notif.type,
              title: notif.title,
              message: notif.message
            });

            // Mark as read
            try {
              await api.patch(`/notifications/${notif.id}/read`);
            } catch { /* ignore */ }
          }
        }

        if (notifications.length > 0) {
          setLastCheckId(notifications[0].id);
        }
      } catch {
        // Silently fail
      }
    };

    // Initial check after short delay
    const initialTimeout = setTimeout(pollNotifications, 2000);
    // Then poll every 5 seconds
    const interval = setInterval(pollNotifications, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isAuthenticated, addToast, lastCheckId]);

  return (
    <NotificationContext.Provider value={{
      toasts, systemAlert, addToast, removeToast, dismissAlert
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
}
