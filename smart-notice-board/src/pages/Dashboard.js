import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import NoticeCard from '../components/notices/NoticeCard';
import StatsGrid from '../components/dashboard/StatsGrid';
import QuickActions from '../components/dashboard/QuickActions';
import '../pages/Dashboard.css';

const Dashboard = () => {
  const { user, isFaculty, isAdmin } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate(); // Added navigate hook

  // ✅ Safe default empty object to prevent “Cannot read properties of null”
  const [dashboardData, setDashboardData] = useState({});
  const [activeFilter, setActiveFilter] = useState('current');

  // ✅ Fetch dashboard data function
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Try primary dashboard stats endpoint (requires auth on backend)
      const response = await axios.get('/api/dashboard/stats', { headers });

      if (response.data && response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        return;
      }
      // If no valid data returned, fall back to public notices
      console.warn('Dashboard stats endpoint returned no data, falling back to public notices');
      throw new Error('No dashboard data');
    } catch (err) {
      console.error('Dashboard stats fetch failed:', err?.response?.data || err.message || err);

      // Fallback: fetch public notices so dashboard still shows recent notices in dev/demo
      try {
        const dept = user?.department || 'All Departments';
        const resp = await axios.get(`/api/notices?department=${encodeURIComponent(dept)}&limit=5`);
        if (resp.data && resp.data.success) {
          const notices = resp.data.data || [];
          setDashboardData({
            currentNotices: notices,
            currentCount: notices.length
          });
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback notices fetch failed:', fallbackErr?.response?.data || fallbackErr.message || fallbackErr);
      }
    }
  }, [user?.department]);

  // ✅ Socket setup for real-time updates
  useEffect(() => {
    fetchDashboardData();
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    const refresh = (event) => {
      console.log(`🔄 ${event} event received — refreshing dashboard...`);
      fetchDashboardData();
    };

    socket.on('new-notice', () => refresh('new-notice'));
    socket.on('notice-update', () => refresh('notice-update'));
    socket.on('notice-deleted', () => refresh('notice-deleted'));
    socket.on('notification-update', () => refresh('notification-update'));

    return () => socket.disconnect();
  }, [fetchDashboardData]);

  // ✅ Filtered notices
  const getFilteredNotices = () => {
    if (!dashboardData) return [];
    switch (activeFilter) {
      case 'current':
        return dashboardData.currentNotices || [];
      case 'upcoming':
        return dashboardData.upcomingNotices || [];
      case 'past':
        return dashboardData.pastNotices || [];
      default:
        return [];
    }
  };

  const filteredNotices = getFilteredNotices();

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's what's happening in your college today</p>
        </div>
      </section>

      {/* Stats Section — safely rendered */}
      <section className="stats-section">
        {dashboardData && (
          <StatsGrid
            stats={dashboardData}
            // Use optional chaining and fallback to avoid runtime crash
            userRole={user?.role || 'student'}
            onRefresh={fetchDashboardData}
          />
        )}
      </section>

      {/* Quick Actions */}
      {(isFaculty || isAdmin) && (
        <QuickActions
          onAction={(action) => {
            addNotification(`You ${action}.`);
            // Redirect to notices page when any quick action is clicked
            navigate('/notices');
          }}
        />
      )}

      {/* Recent Notices Section */}
      <section className="notices-section">
        <div className="section-header">
          <h2>Recent Notices</h2>
          <div className="filter-tabs">
            {['current', 'upcoming', 'past'].map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${
                  activeFilter === filter ? 'active' : ''
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="notices-grid">
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice._id || notice.id} notice={notice} />
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notices found</h3>
            <p>There are no {activeFilter} notices for you at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;