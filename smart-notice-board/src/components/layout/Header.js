import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    addNotification('Successfully logged out', 'success');
    navigate('/'); // Redirect to home after logout
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Left Section - Menu and Brand */}
        <div className="header-left">
          <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="header-brand">
            <h1 className="header-title">CampusConnect</h1>
            <span className="header-subtitle">Smart College Portal</span>
          </div>
        </div>

        {/* Right Section - Notifications and User Menu */}
        <div className="header-right">
          <NotificationBell />
          
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="user-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="user-info-mini">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <svg 
                className={`dropdown-arrow ${showUserMenu ? 'rotate' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="user-dropdown" role="menu">
                <div className="dropdown-header">
                  <div className="user-avatar-large">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder large">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <strong className="user-name-large">{user?.name}</strong>
                    <span className="user-email">{user?.email}</span>
                    <span className="user-department">{user?.department}</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item"
                  onClick={handleProfileClick}
                  role="menuitem"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item logout" 
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;