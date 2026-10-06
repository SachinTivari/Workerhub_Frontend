import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Plus } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // For now, mirroring categories as services until specified otherwise
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/categories`);
      setServices(res.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Services Management</h1>
        <p>View all services provided on the platform.</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>All Services</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Search services..." 
              className="search-input-admin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => alert('Add Service functionality coming soon! (Backend API required)')}>
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
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id || service.id || Math.random()}>
                    <td style={{ fontSize: '1.5rem' }}>{service.icon || '🛠️'}</td>
                    <td style={{ fontWeight: 500 }}>{service.name}</td>
                    <td style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {service.description || 'No description provided'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="View" onClick={() => alert('Service details coming soon!')}>
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
        
        {!loading && filteredServices.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No services found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminServices;
