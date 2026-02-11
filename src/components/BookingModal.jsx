import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import './BookingModal.css'

function BookingModal({ worker, onClose, onSuccess }) {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    work_description: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData(prev => ({
        ...prev,
        customer_name: userData.name || '',
        customer_phone: userData.phone || ''
      }))
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post(`${API_URL}/api/bookings`, {
        worker_id: worker._id || worker.id,
        user_id: user?._id || user?.id,
        ...formData
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content login-prompt" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <div className="login-prompt-content">
            <div className="login-icon">🔐</div>
            <h2>Login Required</h2>
            <p>Please login or sign up to book this worker</p>
            <div className="login-prompt-actions">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Book {worker.name}</h2>
          <p>{worker.category} • ₹{worker.hourly_rate}/hr</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className={user?.name ? 'prefilled' : ''}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="booking_time"
                value={formData.booking_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Work Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              required
            />
          </div>

          <div className="form-group">
            <label>Work Description</label>
            <textarea
              name="work_description"
              value={formData.work_description}
              onChange={handleChange}
              placeholder="Describe the work you need done..."
              rows="4"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal



