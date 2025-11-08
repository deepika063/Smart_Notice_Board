// components/comments/CommentSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ noticeId, onCommentUpdate }) => {  // Added onCommentUpdate prop
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
   
    let mounted = true;
    let socketInstance = null;

    const initializeSocket = () => {
      try {
        const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
          console.log('Socket connected');
          newSocket.emit('join-notice', noticeId);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        newSocket.on('comment-update', (update) => {
          if (!mounted) return;

          switch (update.type) {
            case 'add':
              setComments(prev => [update.comment, ...prev]);
              break;
            case 'edit':
              setComments(prev => 
                prev.map(comment =>
                  comment._id === update.commentId
                    ? { ...comment, content: update.content, isEdited: true }
                    : comment
                )
              );
              break;
            case 'delete':
              setComments(prev => 
                prev.filter(comment => comment._id !== update.commentId)
              );
              break;
            default:
              break;
          }
        });

        socketInstance = newSocket;
        setSocket(newSocket);
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    const fetchComments = async () => {
      if (!mounted) return;
      setLoading(true);
      try {
        const res = await axios.get(`/api/comments/notice/${noticeId}`, {
          timeout: 5000
        });
        if (res.data && res.data.data && mounted) {
          setComments(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
        if (mounted) {
          setComments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSocket();
    fetchComments();

    // Cleanup function
    return () => {
      mounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [noticeId]);

  // Add this useEffect to notify parent when comments count changes
  useEffect(() => {
    if (onCommentUpdate) {
      onCommentUpdate(comments.length);
    }
  }, [comments.length, onCommentUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/comments', {
        noticeId,
        content: newComment,
        _devAuthorName: user?.name || 'Anonymous Student',
        _devAuthorEmail: user?.email || `anonymous-${Date.now()}@student.local`,
        _devAuthorRole: user?.role || 'student',
        _devAuthorDepartment: user?.department || 'General'
      });
      if (res.data && res.data.data) {
        const created = res.data.data;
        setComments([created, ...comments]);
        // Notify parent about comment count update
        if (onCommentUpdate) {
          onCommentUpdate(comments.length + 1);
        }
        // Emit to other clients in the same notice room so they see the new comment
        if (socket) {
          socket.emit('comment-added', { noticeId, comment: created });
        }
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post comment', err);
      alert('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h4>Comments ({comments.length})</h4>
        <div className="comment-stats">
          <span>💬 {comments.length} comments</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="user-avatar">
          <span>{(user?.name || 'A').charAt(0).toUpperCase()}</span>
        </div>
        <div className="comment-input-container">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
            className="comment-input"
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="submit-comment-btn"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {loading ? (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <p>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment._id}
              comment={comment}
              noticeId={noticeId}
              onDelete={(commentId) => {
                setComments(prevComments => 
                  prevComments.filter(c => c._id !== commentId)
                );
                // Notify parent about comment count update
                if (onCommentUpdate) {
                  onCommentUpdate(comments.length - 1);
                }
                socket?.emit('comment-deleted', { noticeId, commentId });
              }}
              onEdit={(commentId, newContent) => {
                setComments(prevComments =>
                  prevComments.map(c =>
                    c._id === commentId
                      ? { ...c, content: newContent, isEdited: true }
                      : c
                  )
                );
                socket?.emit('comment-edited', { noticeId, commentId, content: newContent });
              }}
              onAddReply={(parentId, reply) => {
                setComments(prevComments =>
                  prevComments.map(c =>
                    c._id === parentId
                      ? { ...c, replies: [reply, ...(c.replies || [])] }
                      : c
                  )
                );
                // Notify parent about comment count update for replies
                if (onCommentUpdate) {
                  onCommentUpdate(comments.length + 1);
                }
                socket?.emit('comment-added', { noticeId, comment: reply });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, onDelete, onEdit, onAddReply, noticeId }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`/api/comments/${comment._id}`, {
        content: editedContent,
        _devAuthorName: user?.name || 'Anonymous Student',
        _devAuthorEmail: user?.email || `anonymous-${Date.now()}@student.local`,
        _devAuthorRole: user?.role || 'student',
        _devAuthorDepartment: user?.department || 'General'
      });
      if (res.data?.success) {
        onEdit(comment._id, editedContent);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to edit comment:', err);
      alert('Failed to edit comment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/comments/${comment._id}`, {
        data: {
          _devAuthorName: user?.name || 'Anonymous Student',
          _devAuthorEmail: user?.email || `anonymous-${Date.now()}@student.local`,
          _devAuthorRole: user?.role || 'student',
          _devAuthorDepartment: user?.department || 'General'
        }
      });
      if (res.data?.success) {
        onDelete(comment._id);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
      setIsDeleting(false);
    }
  };

  const isAuthor = user && comment.author?.email === user.email;
  const isAdmin = user?.role === 'admin';
  const canModify = isAuthor || isAdmin;
  const canReply = user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        <span>{comment.author?.name?.charAt(0).toUpperCase() || '?'}</span>
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-user">{comment.author?.name || 'User'}</span>
          <span className="comment-role">{comment.author?.role || ''}</span>
          <span className="comment-time">
            {new Date(comment.createdAt || comment.timestamp).toLocaleDateString()}
          </span>
          {comment.isEdited && <span className="comment-edited">(edited)</span>}
        </div>
        
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="comment-edit-input"
              rows="3"
            />
            <div className="comment-edit-actions">
              <button 
                onClick={() => setIsEditing(false)}
                className="cancel-edit-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSubmit}
                className="save-edit-btn"
                disabled={!editedContent.trim() || editedContent === comment.content}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}
        
        <div className="comment-actions">
          {canModify && !isEditing && (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-btn"
                disabled={isDeleting}
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="delete-btn"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
          {canReply && !isReplying && (
            <button
              className="reply-btn"
              onClick={() => setIsReplying(true)}
            >
              Reply
            </button>
          )}
          {isReplying && (
            <div className="reply-form">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="reply-input"
                rows={2}
                placeholder="Write a reply..."
              />
              <div className="reply-actions">
                <button onClick={() => { setIsReplying(false); setReplyContent(''); }} className="cancel-reply-btn">Cancel</button>
                <button
                  onClick={async () => {
                    if (!replyContent.trim()) return;
                    setIsReplySubmitting(true);
                    try {
                      const res = await axios.post('/api/comments', {
                        noticeId,
                        content: replyContent,
                        parentCommentId: comment._id,
                        _devAuthorName: user?.name || 'Faculty',
                        _devAuthorEmail: user?.email || `faculty-${Date.now()}@local`,
                        _devAuthorRole: user?.role || 'faculty',
                        _devAuthorDepartment: user?.department || 'General'
                      });
                      if (res.data?.data) {
                        const reply = res.data.data;
                        // Inform parent component to add reply locally
                        onAddReply && onAddReply(comment._id, reply);
                        setReplyContent('');
                        setIsReplying(false);
                      }
                    } catch (err) {
                      console.error('Failed to post reply:', err.response?.data || err.message || err);
                      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to post reply';
                      alert(serverMsg);
                    } finally {
                      setIsReplySubmitting(false);
                    }
                  }}
                  className="send-reply-btn"
                  disabled={isReplySubmitting || !replyContent.trim()}
                >
                  {isReplySubmitting ? 'Posting...' : 'Send Reply'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;