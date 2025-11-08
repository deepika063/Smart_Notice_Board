import React from 'react';
import './Quickactions.css';
import { 
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      label: 'Create Notice',
      description: 'Post a new announcement',
      icon: PlusIcon,
      color: 'var(--primary)',
      action: 'created a new notice'
    },
    {
      label: 'Schedule',
      description: 'Plan future notices',
      icon: CalendarIcon,
      color: 'var(--warning)',
      action: 'scheduled a notice'
    },
    {
      label: 'Manage Users',
      description: 'User management',
      icon: UserGroupIcon,
      color: 'var(--secondary)',
      action: 'managed users'
    }
  ];

  return (
    <section className="quick-actions-section">
      <h2>Quick Actions</h2>
      <div className="actions-grid">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="action-card slide-in"
              onClick={() => onAction(action.action)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="action-icon"
                style={{ backgroundColor: action.color }}
              >
                <Icon className="icon" />
              </div>
              <div className="action-content">
                <h3>{action.label}</h3>
                <p>{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;