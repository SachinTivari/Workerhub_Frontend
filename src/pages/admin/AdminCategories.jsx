import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Plus } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Categories Management</h1>
        <p>View all service categories available on the platform.</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>All Categories</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="search-input-admin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => alert('Add Category functionality coming soon! (Backend API required)')}>
              <Plus size={18} /> Add New
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loader" style={{ padding: '40px' }}><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat._id || cat.id || Math.random()}>
                    <td style={{ fontSize: '1.5rem' }}>{cat.icon || '📌'}</td>
                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                    <td style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {cat.description || 'No description provided'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="View" onClick={() => alert('Category details coming soon!')}>
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredCategories.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
