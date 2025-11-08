import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { BellAlertIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (unreadCount > 0 && !isOpen) {
      markAllAsRead();
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className={`notification-bell ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={handleBellClick}
        aria-label={`Notifications (${unreadCount} unread)`}
        title="Notifications"
      >
        <BellAlertIcon className="bell-icon" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="clear-all" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <div className="empty-icon">📭</div>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                      <div className="notification-content">
                        {/* Show only the notice title (or fallback title) per user request */}
                        <div className="notification-title">
                          {(
                            // Prefer explicit notice title from payload
                            notification?.data?.notice?.title
                            // then explicit title field
                            || notification?.title
                            // then try to extract title from message like "New X notice: TITLE"
                            || (typeof notification?.message === 'string' && (() => {
                              const parts = notification.message.split(':');
                              return parts.length > 1 ? parts.slice(1).join(':').trim() : notification.message;
                            })())
                            // finally fall back to string notification or generic label
                            || (typeof notification === 'string' ? notification : 'Notification')
                          )}
                        </div>
                        <span className="notification-time">
                          {notification.timestamp ? new Date(notification.timestamp).toLocaleTimeString() : ''}
                        </span>
                      </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;