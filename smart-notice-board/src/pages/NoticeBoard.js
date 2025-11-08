import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NoticeCard from '../components/notices/NoticeCard';
import NoticeForm from '../components/notices/NoticeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './NoticeBoard.css'; // Add this import at the top
const NoticeBoard = () => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    // Load notices from backend
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

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleCreateNotice = (noticeData) => {
    // Send to backend
    const create = async () => {
      try {
        const res = await axios.post('/api/notices', noticeData);
        if (res.data && res.data.data) {
          setNotices(prev => [res.data.data, ...prev]);
        }
        setShowNoticeForm(false);
      } catch (err) {
        console.error('Create notice failed', err);
        alert('Failed to create notice. Check server logs or auth.');
      }
    };

    create();
  };

  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setShowNoticeForm(true);
  };

  const handleUpdateNotice = (updatedData) => {
    const update = async () => {
      try {
        const id = editingNotice._id || editingNotice.id;
        const res = await axios.put(`/api/notices/${id}`, updatedData);
        if (res.data && res.data.data) {
          setNotices(prev => prev.map(n => (n._id === res.data.data._id ? res.data.data : n)));
        }
        setEditingNotice(null);
        setShowNoticeForm(false);
      } catch (err) {
        console.error('Update failed', err);
        alert('Failed to update notice.');
      }
    };
    update();
  };

  const handleDeleteNotice = (notice) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this notice?');
    if (!confirmDelete) return;

    const remove = async () => {
      try {
        const id = notice._id || notice.id;
        await axios.delete(`/api/notices/${id}`);
        setNotices(prev => prev.filter(n => (n._id || n.id) !== id));
      } catch (err) {
        console.error('Delete failed', err);
        alert('Failed to delete notice.');
      }
    };
    remove();
  };

  if (loading) {
    return (
      <div className="notice-board-page">
        <LoadingSpinner text="Loading notices..." />
      </div>
    );
  }

  return (
    <div className="notice-board-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Notice Board</h1>
          <p>Stay updated with the latest announcements</p>
        </div>
        
        {(isFaculty || isAdmin) && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowNoticeForm(true)}
          >
            + Create Notice
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <select 
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Notice Form Modal */}
      {showNoticeForm && (
        <div className="modal-overlay">
          <div className="modal">
            <NoticeForm 
              initialData={editingNotice}
              onSubmit={(data) => {
                if (editingNotice) {
                  handleUpdateNotice(data);
                } else {
                  handleCreateNotice(data);
                }
              }}
              onCancel={() => {
                setShowNoticeForm(false);
                setEditingNotice(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Notices Grid */}
      <div className="notices-grid">
        {filteredNotices.map((notice) => (
          <NoticeCard 
            key={notice._id} 
            notice={notice}
            onEdit={handleEditNotice}
            onDelete={handleDeleteNotice}
          />
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No notices found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;