import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserApprovals from '../components/admin/UserApprovals';
import NoticeCard from '../components/notices/NoticeCard';

const AdminPanel = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all notices for admin/faculty
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/notices');
        if (res.data && res.data.data) {
          setNotices(res.data.data);
        } else if (res.data) {
          setNotices(res.data);
        }
      } catch (err) {
        console.error('Failed to load notices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Access control - only admin and faculty can access
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return (
      <div className="admin-panel">
        <div className="error-page">
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Welcome to the administration dashboard</p>
      </div>

      {/* User Approvals Section - Only for admin */}
      {user.role === 'admin' && (
        <div className="admin-section">
          <h2>User Approvals</h2>
          <UserApprovals />
        </div>
      )}

      {/* Statistics Section */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">1,247</div>
        </div>
        <div className="stat-card">
          <h3>Active Notices</h3>
          <div className="stat-number">{notices.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <div className="stat-number">12</div>
        </div>
      </div>

      {/* Notices Management Section */}
      <div className="admin-section">
        <h2>Manage Notices</h2>
        {loading ? (
          <div style={{ padding: '2rem' }}>Loading notices...</div>
        ) : (
          <div className="notices-grid">
            {notices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No notices found</h3>
                <p>There are no notices to manage.</p>
              </div>
            ) : (
              notices.map((notice) => (
                <NoticeCard key={notice._id || notice.id} notice={notice} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card">
            <h3>Manage Users</h3>
            <p>Add, edit, or remove users</p>
          </button>
          <button className="action-card">
            <h3>System Settings</h3>
            <p>Configure platform settings</p>
          </button>
          <button className="action-card">
            <h3>Analytics</h3>
            <p>View usage statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;