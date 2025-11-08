import React, { useState } from 'react';
import './NoticeForm.css';
const NoticeForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    content: '',
    category: 'academic',
    department: 'All Departments',
    priority: 'medium',
    target: [],
    isPublished: true,
    scheduledFor: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="notice-form">
      <h2>{initialData ? 'Edit Notice' : 'Create New Notice'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter notice title"
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Enter notice content"
            rows="6"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="academic">Academic</option>
              <option value="events">Events</option>
              <option value="exams">Exams</option>
              <option value="circulars">Circulars</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="All Departments">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Schedule Options</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={formData.isPublished ? 'publish' : 'schedule'}
              onChange={(e) => {
                const shouldPublish = e.target.value === 'publish';
                setFormData({
                  ...formData,
                  isPublished: shouldPublish,
                  scheduledFor: shouldPublish ? null : (formData.scheduledFor || new Date().toISOString().slice(0, 16))
                });
              }}
            >
              <option value="publish">Publish Now</option>
              <option value="schedule">Schedule for Later</option>
            </select>
            
            {!formData.isPublished && (
              <input
                type="datetime-local"
                value={formData.scheduledFor || ''}
                onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                min={new Date().toISOString().slice(0, 16)}
                required={!formData.isPublished}
              />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Notice' : 'Create Notice'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onCancel && onCancel()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;