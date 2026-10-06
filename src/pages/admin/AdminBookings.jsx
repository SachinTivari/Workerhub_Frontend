import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, XCircle } from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Backend /api/bookings returns all bookings (might need adjustment if backend forces user_id check, but it usually returns all for admins or without filter)
      const res = await axios.get(`${API_URL}/api/bookings`);
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span className="status-badge status-approved">Completed</span>;
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'cancelled':
        return <span className="status-badge status-blocked">Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.worker_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.worker_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Bookings Management</h1>
        <p>Monitor all platform bookings and transactions.</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>All Bookings</h3>
          <input 
            type="text" 
            placeholder="Search by worker, category, or status..." 
            className="search-input-admin"
            style={{ width: '300px' }}
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
                  <th>Date</th>
                  <th>Service</th>
                  <th>Worker</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id || Math.random()}>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{booking.worker_category || 'Service'}</td>
                    <td>{booking.worker_name || 'N/A'}</td>
                    <td>₹{booking.total_amount || booking.amount || '0'}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{booking.payment_status || 'Pending'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn" 
                          title="View" 
                          onClick={() => {
                            setSelectedBooking(booking);
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
        
        {!loading && filteredBookings.length === 0 && (
          <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No bookings found.
          </div>
        )}
      </div>

      {/* View Booking Modal */}
      {showViewModal && selectedBooking && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Booking Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div className="admin-modal-content">
              <div className="detail-group">
                <label>Booking ID</label>
                <p style={{ fontSize: '0.8rem' }}>{selectedBooking._id}</p>
              </div>
              <div className="detail-group">
                <label>Date</label>
                <p>{new Date(selectedBooking.date).toLocaleDateString()}</p>
              </div>
              <div className="detail-group">
                <label>Worker</label>
                <p>{selectedBooking.worker_name || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Service Category</label>
                <p>{selectedBooking.worker_category || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Worker Phone</label>
                <p>{selectedBooking.worker_phone || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Total Amount</label>
                <p>₹{selectedBooking.total_amount || selectedBooking.amount || '0'}</p>
              </div>
              <div className="detail-group">
                <label>Booking Status</label>
                <p>{getStatusBadge(selectedBooking.status)}</p>
              </div>
              <div className="detail-group">
                <label>Payment Status</label>
                <p style={{ textTransform: 'capitalize' }}>{selectedBooking.payment_status || 'Pending'}</p>
              </div>
              {selectedBooking.notes && (
                <div className="detail-group" style={{ gridColumn: 'span 2' }}>
                  <label>Notes</label>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
