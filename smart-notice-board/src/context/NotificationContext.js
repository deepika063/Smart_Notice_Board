import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io as ioClient } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

// ✅ Your backend API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const socketRef = useRef(null);

  // Helper: get auth headers if token exists
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const addNotification = (notification) => {
    const payload = typeof notification === 'string' ? { message: notification } : (notification || {});
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...payload
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
    setUnreadCount((prev) => prev + 1);
  };

  // Socket.io connection
  useEffect(() => {
    loadNotifications();
    if (!user) return;

    const socket = ioClient(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      const joinId = user?.id || user?._id || null;
      if (joinId) socket.emit('join-room', joinId);
    });

    socket.on('new-notice', (payload) => {
      const notice = payload?.notice || {};
      const message = payload?.message || `New notice: ${notice.title || ''}`;
      addNotification({
        title: notice.title || 'New Notice',
        message,
        data: { notice }
      });
    });

    socket.on('new-comment', (payload) => {
      const comment = payload?.comment || {};
      const notice = payload?.notice || {};
      const message = payload?.message || `${comment.author?.name || 'Someone'} commented on ${notice.title || 'a notice'}`;
      addNotification({
        title: 'New Comment',
        message,
        data: { comment, notice }
      });
    });

    socket.on('disconnect', () => {});

    return () => socket.disconnect();
  }, [user]);

  // Load notifications
  const loadNotifications = async () => {
    try {
      const headers = getAuthHeaders();

      if (headers.Authorization) {
        const resp = await fetch(`${API_BASE}/api/notifications?limit=10`, { headers });
        const data = await resp.json();

        if (data.success) {
          const normalized = (data.data || []).map((n) => ({
            id: n._id,
            title: n.relatedNotice?.title || n.title || n.message,
            message: n.message,
            timestamp: n.createdAt,
            read: !!n.isRead,
            data: { notice: n.relatedNotice || null }
          }));
          setNotifications(normalized);
          setUnreadCount(data.unreadCount || 0);
          return;
        }
      }

      // Fallback to public notices
      const dept = (user && user.department) ? user.department : 'All Departments';
      const noticesResp = await fetch(
        `${API_BASE}/api/notices?department=${encodeURIComponent(dept)}&limit=5`
      );
      const noticesData = await noticesResp.json();

      if (noticesData.success) {
        const notifs = (noticesData.data || []).map((n) => ({
          id: n._id,
          title: n.title,
          message: `New notice: ${n.title}`,
          timestamp: n.createdAt,
          read: false,
          data: { notice: n }
        }));
        setNotifications(notifs);
        setUnreadCount(notifs.length);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    const headers = getAuthHeaders();
    if (headers.Authorization) {
      fetch(`${API_BASE}/api/notifications/${id}/read`, { method: 'PUT', headers })
        .then(() => loadNotifications())
        .catch((err) => console.error('Mark as read failed:', err));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    const headers = getAuthHeaders();
    if (headers.Authorization) {
      fetch(`${API_BASE}/api/notifications/read-all`, { method: 'PUT', headers })
        .then(() => loadNotifications())
        .catch((err) => console.error('Mark all read failed:', err));
    }
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    refreshNotifications: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
