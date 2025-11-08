import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  ChartBarIcon,
  BellAlertIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon className="icon" />
      </div>
      <div className="stat-content">
        <h3>{value ?? 0}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

const StatsGrid = ({ stats, userRole, onRefresh }) => {
  // ✅ Always call hooks first
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    socket.on('new-notice', () => {
      console.log('🆕 StatsGrid: New notice added');
      onRefresh && onRefresh();
    });

    socket.on('notice-update', () => {
      console.log('✏️ StatsGrid: Notice updated');
      onRefresh && onRefresh();
    });

    socket.on('notice-deleted', () => {
      console.log('🗑️ StatsGrid: Notice deleted');
      onRefresh && onRefresh();
    });

    return () => socket.disconnect();
  }, [onRefresh]);

  // ✅ Guard rendering safely (after hooks)
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="stats-grid">
        <p style={{ textAlign: 'center', color: '#888' }}>Loading stats...</p>
      </div>
    );
  }

  const statConfigs = {
    student: [
      { key: 'currentCount', color: 'var(--primary)', icon: BellAlertIcon },
      { key: 'unreadNotifications', color: 'var(--accent)', icon: BellAlertIcon },
      { key: 'myComments', color: 'var(--success)', icon: UserGroupIcon },
    ],
    faculty: [
      { key: 'publishedNotices', color: 'var(--primary)', icon: BellAlertIcon },
      { key: 'unreadNotifications', color: 'var(--accent)', icon: BellAlertIcon },
      { key: 'scheduledNotices', color: 'var(--warning)', icon: ClockIcon },
      { key: 'myComments', color: 'var(--success)', icon: UserGroupIcon },
    ],
    admin: [
      { key: 'totalNotices', color: 'var(--primary)', icon: BellAlertIcon },
      { key: 'totalUsers', color: 'var(--success)', icon: UserGroupIcon },
      { key: 'totalComments', color: 'var(--secondary)', icon: ChartBarIcon },
    ]
  };

  const currentStats = statConfigs[userRole] || statConfigs.student;

  return (
    <div className="stats-grid">
      {currentStats.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.key.replace(/([A-Z])/g, ' $1').trim()}
          value={stats[stat.key] ?? 0}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
