import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserApprovals = () => {
  const { pendingApprovals, approveUser, rejectUser } = useAuth();

  if (pendingApprovals.length === 0) {
    return (
      <div className="empty-approvals">
        <div className="empty-icon">✅</div>
        <h3>No pending approvals</h3>
        <p>All registration requests have been processed.</p>
      </div>
    );
  }

  return (
    <div className="user-approvals">
      <h3>Pending Approvals ({pendingApprovals.length})</h3>
      <div className="approvals-list">
        {pendingApprovals.map((user) => (
          <div key={user.id} className="approval-card">
            <div className="user-info">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div className="user-details">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <div className="user-meta">
                  <span className="role-badge">{user.role}</span>
                  <span className="department">{user.department}</span>
                  {user.studentId && <span className="student-id">ID: {user.studentId}</span>}
                </div>
                <small>Registered: {new Date(user.registeredAt).toLocaleDateString()}</small>
              </div>
            </div>
            <div className="approval-actions">
              <button 
                className="btn btn-success btn-sm"
                onClick={() => approveUser(user.id)}
              >
                Approve
              </button>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => rejectUser(user.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserApprovals;