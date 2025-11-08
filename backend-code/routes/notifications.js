import React, { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notifications securely
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token"); // get JWT token
      if (!token) {
        console.warn("⚠️ No token found, skipping notifications fetch");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ Include JWT for authentication
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        console.error("Notification fetch error:", data.message);
      }

    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark a notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      // Refresh after marking as read
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/read-all`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // ✅ Delete a notification
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Refresh after deletion
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
