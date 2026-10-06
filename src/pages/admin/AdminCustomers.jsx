import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Mail, Phone, MapPin, XCircle } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/users`);
      // Filter out admins if you only want to see regular customers
      // Or keep them all. We'll show all users but maybe label admins
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <span className="status-badge status-approved" style={{ backgroundColor: 'rgba(52, 152, 219, 0.15)', color: '#3498db', borderColor: 'rgba(52, 152, 219, 0.3)' }}>Admin</span>;
    }
    return <span className="status-badge status-pending" style={{ backgroundColor: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', borderColor: 'rgba(46, 204, 113, 0.3)' }}>Customer</span>;
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Customers Management</h1>
        <p>View and manage all registered users on the platform.</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>All Users</h3>
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="search-input-admin"
            style={{ width: '280px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="loader" style={{ padding: '40px' }}><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td style={{ fontWeight: 500 }}>{customer.name}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                          <Mail size={12} /> {customer.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)' }}>
                          <Phone size={12} /> {customer.phone}
                        </span>
                      </div>
                    </td>
                    <td>{getRoleBadge(customer.role)}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn" 
                          title="View Details" 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowViewModal(true);
                          }}
                        >
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
        
        {!loading && filteredCustomers.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No customers found.
          </div>
        )}
      </div>

      {/* View Customer Modal */}
      {showViewModal && selectedCustomer && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div className="admin-modal-content">
              <div className="detail-group">
                <label>Name</label>
                <p>{selectedCustomer.name}</p>
              </div>
              <div className="detail-group">
                <label>Role</label>
                <p>{getRoleBadge(selectedCustomer.role)}</p>
              </div>
              <div className="detail-group">
                <label>Email Address</label>
                <p>{selectedCustomer.email || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Phone Number</label>
                <p>{selectedCustomer.phone || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Joined Date</label>
                <p>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="detail-group">
                <label>Account ID</label>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{selectedCustomer._id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
