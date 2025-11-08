import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-role">{user?.role}</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label>Username</label>
            <span>{user?.username || user?.name || 'Not specified'}</span>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <span>{user?.email || 'Not specified'}</span>
          </div>
          <div className="detail-item">
            <label>User Type</label>
            <span>{user?.role || 'Not specified'}</span>
          </div>
          <div className="detail-item">
            <label>Phone Number</label>
            <span>{user?.phoneNumber || 'Not specified'}</span>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Profile;