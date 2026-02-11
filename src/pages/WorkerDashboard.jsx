import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import './WorkerDashboard.css'

function WorkerDashboard() {
  const navigate = useNavigate()
  const [worker, setWorker] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const storedWorker = localStorage.getItem('worker')
    if (!storedWorker) {
      navigate('/worker-login')
      return
    }
    const workerData = JSON.parse(storedWorker)
    setWorker(workerData)
    fetchBookings(workerData.id)
    setLoading(false)
  }, [navigate])

  const fetchBookings = async (workerId) => {
    try {
      const res = await axios.get(`${API_URL}/api/workers/${workerId}/bookings`)
      setBookings(res.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const updateAvailability = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await axios.patch(`${API_URL}/api/workers/${worker.id}`, {
        availability: newStatus
      })
      const updatedWorker = res.data.worker
      setWorker(updatedWorker)
      localStorage.setItem('worker', JSON.stringify(updatedWorker))
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Failed to update availability')
    } finally {
      setUpdating(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API_URL}/api/bookings/${bookingId}`, { status })
      // Refresh bookings
      fetchBookings(worker.id)
      // If completed or cancelled, availability will be updated by backend
      if (status === 'completed' || status === 'cancelled') {
        const res = await axios.get(`${API_URL}/api/workers/${worker.id}`)
        setWorker(prev => ({ ...prev, availability: res.data.availability }))
        localStorage.setItem('worker', JSON.stringify({ ...worker, availability: res.data.availability }))
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('worker')
    navigate('/')
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

  if (loading || !worker) {
    return (
      <div className="worker-dashboard">
        <div className="container">
          <div className="loader"><div className="spinner"></div></div>
        </div>
      </div>
    )
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const completedBookings = bookings.filter(b => b.status === 'completed')

  return (
    <div className="worker-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="worker-info">
              <div className="worker-avatar-large">
                {worker.photo_url ? (
                  <img src={worker.photo_url} alt={worker.name} />
                ) : (
                  <span>{worker.name?.charAt(0)}</span>
                )}
              </div>
              <div className="worker-details">
                <h1>{worker.name}</h1>
                <p className="worker-category">{worker.category}</p>
                <p className="worker-location">📍 {worker.location}</p>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div className="stat-info">
              <span className="stat-number">{pendingBookings.length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-info">
              <span className="stat-number">{confirmedBookings.length}</span>
              <span className="stat-label">Confirmed</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-info">
              <span className="stat-number">{completedBookings.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <span className="stat-number">₹{worker.hourly_rate}</span>
              <span className="stat-label">Per Day</span>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="availability-section">
          <h2>Your Availability Status</h2>
          <div className="availability-buttons">
            <button 
              className={`avail-btn available ${worker.availability === 'available' ? 'active' : ''}`}
              onClick={() => updateAvailability('available')}
              disabled={updating}
            >
              <span className="avail-icon">🟢</span>
              <span>Available</span>
            </button>
            <button 
              className={`avail-btn busy ${worker.availability === 'busy' ? 'active' : ''}`}
              onClick={() => updateAvailability('busy')}
              disabled={updating}
            >
              <span className="avail-icon">🟡</span>
              <span>Busy</span>
            </button>
            <button 
              className={`avail-btn offline ${worker.availability === 'offline' ? 'active' : ''}`}
              onClick={() => updateAvailability('offline')}
              disabled={updating}
            >
              <span className="avail-icon">🔴</span>
              <span>Offline</span>
            </button>
          </div>
          {updating && <p className="updating-text">Updating...</p>}
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-card">
              <h3>Profile Information</h3>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="label">📞 Phone</span>
                  <span className="value">{worker.phone}</span>
                </div>
                {worker.email && (
                  <div className="detail-row">
                    <span className="label">📧 Email</span>
                    <span className="value">{worker.email}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">💼 Category</span>
                  <span className="value">{worker.category}</span>
                </div>
                <div className="detail-row">
                  <span className="label">💰 Daily Rate</span>
                  <span className="value">₹{worker.hourly_rate}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📍 Location</span>
                  <span className="value">{worker.location || 'Not set'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">⭐ Rating</span>
                  <span className="value">{worker.rating || '4.5'} / 5</span>
                </div>
                {worker.aadhaar_verified && (
                  <div className="detail-row verified">
                    <span className="label">✅ Aadhaar</span>
                    <span className="value">Verified</span>
                  </div>
                )}
              </div>
              {worker.bio && (
                <div className="profile-bio">
                  <h4>About</h4>
                  <p>{worker.bio}</p>
                </div>
              )}
              {worker.skills && (
                <div className="profile-skills">
                  <h4>Skills</h4>
                  <div className="skills-tags">
                    {worker.skills.split(',').map((skill, i) => (
                      <span key={i} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            {bookings.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>No bookings yet</h3>
                <p>When customers book you, they'll appear here</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-item">
                    <div className="booking-header">
                      <div className="customer-info">
                        <h4>{booking.customer_name}</h4>
                        <p>📞 {booking.customer_phone}</p>
                      </div>
                      <span className={`booking-status ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="detail">
                        <span>📅</span>
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="detail">
                        <span>🕐</span>
                        <span>{booking.booking_time}</span>
                      </div>
                      <div className="detail">
                        <span>📍</span>
                        <span>{booking.address}</span>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="booking-notes">
                        <p>📝 {booking.notes}</p>
                      </div>
                    )}
                    {booking.status === 'pending' && (
                      <div className="booking-actions">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        >
                          ✅ Accept
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        >
                          ❌ Decline
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="booking-actions">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => updateBookingStatus(booking._id, 'completed')}
                        >
                          🏆 Mark Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerDashboard

