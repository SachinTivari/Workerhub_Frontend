import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../config'
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, IndianRupee, Star, X } from 'lucide-react'
import './UserDashboard.css'

function UserBookings() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Complaint Modal State
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [complaintForm, setComplaintForm] = useState({
    issue: 'Worker didn\'t arrive',
    description: ''
  })
  const [complaintSubmitting, setComplaintSubmitting] = useState(false)

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [paymentSubmitting, setPaymentSubmitting] = useState(false)

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  const navigate = useNavigate()

  const fetchBookings = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/bookings?user_id=${userId}`)
      setBookings(res.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }
    
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    
    fetchBookings(parsedUser.id || parsedUser._id)
  }, [navigate])

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBooking) return
    setPaymentSubmitting(true)
    try {
      await axios.post(`${API_URL}/api/bookings/${selectedBooking._id}/pay`, { payment_method: paymentMethod })
      alert('Payment successful!')
      setShowPaymentModal(false)
      fetchBookings(user.id || user._id)
    } catch (error) {
      alert('Payment failed')
    } finally {
      setPaymentSubmitting(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBooking) return
    setReviewSubmitting(true)
    try {
      await axios.post(`${API_URL}/api/reviews`, {
        booking_id: selectedBooking._id,
        worker_id: selectedBooking.worker_id?._id || selectedBooking.worker_id,
        user_id: user.id || user._id,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text
      })
      alert('Review submitted successfully!')
      setShowReviewModal(false)
      fetchBookings(user.id || user._id)
    } catch (error) {
      alert(error.response?.data?.error || 'Review submission failed')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleComplaintSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBooking) return

    setComplaintSubmitting(true)
    try {
      await axios.post(`${API_URL}/api/complaints`, {
        booking_id: selectedBooking._id,
        user_id: user.id || user._id,
        worker_id: selectedBooking.worker_id?._id,
        issue: complaintForm.issue,
        description: complaintForm.description
      })
      alert('Complaint submitted successfully. Our support team will review it.')
      setShowComplaintModal(false)
      setComplaintForm({ issue: 'Worker didn\'t arrive', description: '' })
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert('Failed to submit complaint. Please try again.')
    } finally {
      setComplaintSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="user-dashboard-page">
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.7)' }}>
          Loading your bookings...
        </div>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={18} className="text-success" />
      case 'cancelled': return <XCircle size={18} className="text-danger" />
      default: return <Clock size={18} className="text-warning" />
    }
  }

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>My Bookings</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>Manage and track all your service requests.</p>
        </div>
      </div>

      <div className="bookings-section">
        <div className="table-responsive">
          {bookings.length > 0 ? (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="worker-info">
                        <p>{booking.worker_name || booking.worker_id?.name || 'Worker (Deleted)'}</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button 
                            className="btn-issue"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowComplaintModal(true)
                            }}
                          >
                            <AlertTriangle size={14} /> Raise Issue
                          </button>
                          
                          {booking.status === 'completed' && booking.payment_status === 'pending' && (
                            <button 
                              className="btn-action success"
                              style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowPaymentModal(true)
                              }}
                            >
                              <IndianRupee size={14} /> Pay Now
                            </button>
                          )}
                          
                          {booking.status === 'completed' && booking.payment_status === 'paid' && !booking.is_reviewed && (
                            <button 
                              className="btn-action"
                              style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowReviewModal(true)
                              }}
                            >
                              <Star size={14} /> Rate Worker
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{booking.worker_category || booking.worker_id?.category || 'Service'}</td>
                    <td>
                      <div className="date-time">
                        <span><Calendar size={14} /> {new Date(booking.booking_date).toLocaleDateString()}</span>
                        <span><Clock size={14} /> {booking.booking_time}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              You haven't made any bookings yet.
            </div>
          )}
        </div>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowComplaintModal(false)}>
              <X size={24} />
            </button>
            <h3>Raise an Issue</h3>
            <form className="modal-form" onSubmit={handleComplaintSubmit}>
              <div className="form-group">
                <label>Issue Type</label>
                <select 
                  value={complaintForm.issue}
                  onChange={(e) => setComplaintForm({...complaintForm, issue: e.target.value})}
                  required
                >
                  <option value="Worker didn't arrive">Worker didn't arrive</option>
                  <option value="Wrong service">Wrong service</option>
                  <option value="Payment issue">Payment issue</option>
                  <option value="Worker behaviour">Worker behaviour</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Please describe the issue in detail..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn-submit" disabled={complaintSubmitting}>
                {complaintSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>
              <X size={24} />
            </button>
            <h3>Complete Payment</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Service Amount</span>
                <span>₹{selectedBooking?.worker_id?.daily_rate || selectedBooking?.service_amount || 299}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Platform Fee</span>
                <span>₹{selectedBooking?.platform_fee || 20}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total Amount</span>
                <span style={{ color: '#00e676' }}>₹{(selectedBooking?.worker_id?.daily_rate || selectedBooking?.service_amount || 299) + (selectedBooking?.platform_fee || 20)}</span>
              </div>
            </div>
            
            <form className="modal-form" onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="net_banking">Net Banking</option>
                  <option value="cash">Cash after service</option>
                </select>
              </div>
              <button type="submit" className="btn-submit" style={{ background: '#00e676' }} disabled={paymentSubmitting}>
                {paymentSubmitting ? 'Processing...' : `Pay ₹${(selectedBooking?.worker_id?.daily_rate || selectedBooking?.service_amount || 299) + (selectedBooking?.platform_fee || 20)}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowReviewModal(false)}>
              <X size={24} />
            </button>
            <h3>Rate Your Experience</h3>
            <form className="modal-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label style={{ textAlign: 'center', marginBottom: '10px', display: 'block' }}>How was your experience?</label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: star <= reviewForm.rating ? '#fcd34d' : 'rgba(255,255,255,0.2)'
                      }}
                    >
                      <Star size={32} fill={star <= reviewForm.rating ? '#fcd34d' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Write a Review (Optional)</label>
                <textarea 
                  placeholder="Share your experience with this worker..."
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({...reviewForm, review_text: e.target.value})}
                  rows="4"
                />
              </div>
              <button type="submit" className="btn-submit" style={{ background: '#3b82f6' }} disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default UserBookings
