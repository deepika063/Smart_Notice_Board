import React, { useState } from 'react';

const CommentForm = ({ onSubmit, placeholder = "Add a comment...", autoFocus = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows="3"
        autoFocus={autoFocus}
      />
      <div className="comment-form-actions">
        <button type="submit" className="btn btn-primary btn-sm">
          Post
        </button>
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={() => setContent('')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CommentForm;