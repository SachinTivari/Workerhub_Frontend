import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, CheckCircle, XCircle, Ban, Edit, Trash2 } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/workers`);
      setWorkers(res.data);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWorkerStatus = (worker) => {
    if (worker.account_status) {
      return worker.account_status.charAt(0).toUpperCase() + worker.account_status.slice(1);
    }
    if (worker.aadhaar_verified) return 'Approved';
    return 'Pending';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="status-badge status-approved">Approved</span>;
      case 'Pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'Blocked':
        return <span className="status-badge status-blocked">Blocked</span>;
      case 'Rejected':
        return <span className="status-badge status-rejected" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', display: 'inline-block', backgroundColor: 'rgba(255,107,107,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.2)' }}>Rejected</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleAction = async (action, workerId) => {
    console.log(`${action} triggered for worker ${workerId}`);
    
    let newStatus = '';
    if (action === 'Approve') newStatus = 'approved';
    else if (action === 'Reject') newStatus = 'rejected';
    else if (action === 'Block') newStatus = 'blocked';

    if (newStatus) {
      try {
        await axios.patch(`${API_URL}/api/admin/workers/${workerId}/status`, { status: newStatus });
        
        // Update local state
        setWorkers(workers.map(w => {
          if (w._id === workerId) {
            return { ...w, account_status: newStatus };
          }
          return w;
        }));
        
        alert(`Worker successfully ${newStatus}!`);
      } catch (error) {
        console.error('Failed to update worker status:', error);
        alert('Failed to update worker status. Please try again.');
      }
    } else if (action === 'View') {
      const worker = workers.find(w => w._id === workerId);
      if (worker) {
        setSelectedWorker(worker);
        setShowViewModal(true);
      }
    } else {
      // For Edit, Delete
      alert(`${action} functionality coming soon!`);
    }
  };

  const filteredWorkers = workers.filter(w => {
    const nameMatch = w.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const serviceMatch = w.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || serviceMatch;
  });

  return (
    <div className="admin-workers">
      <div className="admin-page-header">
        <h1>Worker Management</h1>
        <p>Manage, approve, or block workers on the platform.</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>All Workers</h3>
          <input 
            type="text" 
            placeholder="Search workers..." 
            className="search-input-admin"
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
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker) => (
                  <tr key={worker._id}>
                    <td>{worker.name}</td>
                    <td>{worker.category}</td>
                    <td>{getStatusBadge(getWorkerStatus(worker))}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="View" onClick={() => handleAction('View', worker._id)}>
                          <Eye size={16} />
                        </button>
                        <button className="action-btn approve" title="Approve" onClick={() => handleAction('Approve', worker._id)}>
                          <CheckCircle size={16} />
                        </button>
                        <button className="action-btn reject" title="Reject" onClick={() => handleAction('Reject', worker._id)}>
                          <XCircle size={16} />
                        </button>
                        <button className="action-btn block" title="Block" onClick={() => handleAction('Block', worker._id)}>
                          <Ban size={16} />
                        </button>
                        <button className="action-btn edit" title="Edit" onClick={() => handleAction('Edit', worker._id)}>
                          <Edit size={16} />
                        </button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleAction('Delete', worker._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredWorkers.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No workers found.
          </div>
        )}
      </div>

      {/* View Worker Modal */}
      {showViewModal && selectedWorker && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Worker Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div className="admin-modal-content">
              <div className="detail-group">
                <label>Name</label>
                <p>{selectedWorker.name}</p>
              </div>
              <div className="detail-group">
                <label>Email</label>
                <p>{selectedWorker.email || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Phone</label>
                <p>{selectedWorker.phone}</p>
              </div>
              <div className="detail-group">
                <label>Service Category</label>
                <p>{selectedWorker.category}</p>
              </div>
              <div className="detail-group">
                <label>Location</label>
                <p>{selectedWorker.location || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Daily Rate</label>
                <p>₹{selectedWorker.daily_rate}</p>
              </div>
              <div className="detail-group">
                <label>Status</label>
                <p>{getWorkerStatus(selectedWorker)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWorkers;
