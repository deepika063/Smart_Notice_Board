import React, { useState } from 'react';
import CommentForm from './CommentForm';

const CommentCard = ({ comment, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (content) => {
    onReply(comment.id, content);
    setShowReplyForm(false);
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-user">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=3b82f6&color=fff`}
            alt={comment.user.name}
            className="comment-avatar"
          />
          <div>
            <strong>{comment.user.name}</strong>
            <span className="user-role">{comment.user.role}</span>
          </div>
        </div>
        <span className="comment-time">
          {comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString()}
        </span>
      </div>

      <div className="comment-content">
        <p>{comment.content}</p>
      </div>

      <div className="comment-actions">
        <button 
          className="action-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          💬 Reply
        </button>
      </div>

      {showReplyForm && (
        <div className="reply-form">
          <CommentForm 
            onSubmit={handleReply}
            placeholder="Write a reply..."
            autoFocus
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;