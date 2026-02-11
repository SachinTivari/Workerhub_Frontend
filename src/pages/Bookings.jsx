import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import './Bookings.css'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      fetchBookings(userData._id || userData.id)
    } else {
      setLoading(false)
    }
  }, [])

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

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed'
      case 'completed': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="bookings-page">
        <div className="container">
          <div className="login-required">
            <div className="icon">🔐</div>
            <h2>Login Required</h2>
            <p>Please login to view your bookings</p>
            <div className="login-actions">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            Track and manage all your worker bookings
          </p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id || booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-worker">
                    <div className="worker-avatar">
                      {booking.worker_name?.charAt(0)}
                    </div>
                    <div>
                      <h3>{booking.worker_name}</h3>
                      <p>{booking.worker_category}</p>
                    </div>
                  </div>
                  <span className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date</span>
                    <span className="detail-value">{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🕐 Time</span>
                    <span className="detail-value">{booking.booking_time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Address</span>
                    <span className="detail-value">{booking.address}</span>
                  </div>
                  {booking.work_description && (
                    <div className="detail-row">
                      <span className="detail-label">📝 Work</span>
                      <span className="detail-value">{booking.work_description}</span>
                    </div>
                  )}
                </div>

                <div className="booking-footer">
                  <span className="booking-id">Booking #{(booking._id || booking.id)?.slice(-6)}</span>
                  <Link to={`/worker/${booking.worker_id?._id || booking.worker_id}`} className="view-worker-btn">
                    View Worker →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No bookings yet</h3>
            <p>Start by booking a skilled worker for your needs</p>
            <Link to="/workers" className="btn btn-primary">
              Find Workers
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings



