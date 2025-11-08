import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentSection from '../comments/CommentSection';
import './NoticeCard.css';

const NoticeCard = ({ notice, onEdit, onDelete }) => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(notice.comments?.length || 0);

  // Update comments count when notice prop changes
  useEffect(() => {
    setCommentsCount(notice.comments?.length || 0);
  }, [notice.comments]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const canEditDelete = (isFaculty || isAdmin) && 
    (isAdmin || (user && notice.author && notice.author._id === user._id));

  // Function to update comments count from child component
  const handleCommentUpdate = (newCount) => {
    setCommentsCount(newCount);
  };

  return (
    <div className="notice-card">
      <div className="notice-header">
        <div className="notice-meta">
          <div 
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(notice.priority) }}
          >
            {notice.priority}
          </div>
          <span className="notice-date">
            📅 {new Date(notice.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {canEditDelete && (
          <div className="notice-actions">
            <button 
              className="action-btn edit" 
              onClick={() => onEdit && onEdit(notice)}
              title={isAdmin ? "Admin can edit any notice" : "You can only edit your own notices"}
            >
              ✏️ Edit
            </button>
            <button 
              className="action-btn delete" 
              onClick={() => onDelete && onDelete(notice)}
              title={isAdmin ? "Admin can delete any notice" : "You can only delete your own notices"}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      <div className="notice-content">
        <h3 
          className="notice-title"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {notice.title}
        </h3>
        
        {isExpanded && (
          <div className="notice-expanded">
            <p className="notice-description">{notice.content}</p>
            
            <div className="notice-meta-details">
              <div className="meta-item">
                👤 <span>By: {notice.author?.name || 'Admin'}</span>
              </div>
              <div className="meta-item">
                🎯 <span>Target: {notice.target?.join(', ') || 'All Students'}</span>
              </div>
            </div>

            <div className="notice-actions-footer">
              <button 
                className={`action-btn ${showComments ? 'active' : ''}`}
                onClick={() => setShowComments(!showComments)}
              >
                💬 Comments ({commentsCount})
              </button>
            </div>

            {showComments && (
              <CommentSection 
                noticeId={notice.id} 
                onCommentUpdate={handleCommentUpdate}
              />
            )}
          </div>
        )}
      </div>

      {!isExpanded && (
        <div className="notice-footer">
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(true)}
          >
            Read more
          </button>
          <span className="comment-count">
            💬 {commentsCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default NoticeCard;