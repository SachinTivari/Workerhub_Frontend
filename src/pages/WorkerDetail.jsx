import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BookingModal from '../components/BookingModal'
import { API_URL } from '../config'
import './WorkerDetail.css'

function WorkerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    fetchWorker()
  }, [id])

  const fetchWorker = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/workers/${id}`)
      setWorker(res.data)
    } catch (error) {
      console.error('Error fetching worker:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityClass = (availability) => {
    switch (availability) {
      case 'available': return 'status-available'
      case 'busy': return 'status-busy'
      default: return 'status-offline'
    }
  }

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available': return 'Available'
      case 'busy': return 'Unavailable'
      default: return 'Offline'
    }
  }

  const handleBookingSuccess = () => {
    setShowBookingModal(false)
    alert('Booking created successfully! The worker will contact you soon.')
    navigate('/bookings')
  }

  if (loading) {
    return (
      <div className="worker-detail-page">
        <div className="container">
          <div className="loader"><div className="spinner"></div></div>
        </div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="worker-detail-page">
        <div className="container">
          <div className="empty-state">
            <div className="icon">😕</div>
            <h3>Worker not found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/workers')}>
              Browse Workers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="worker-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="worker-detail-grid">
          {/* Main Info */}
          <div className="worker-main-info">
            <div className="worker-header">
              <div className="worker-avatar-large">
                {worker.photo_url ? (
                  <img src={worker.photo_url} alt={worker.name} />
                ) : (
                  <span>{worker.name?.charAt(0)}</span>
                )}
              </div>
              <div className="worker-title">
                <h1>{worker.name}</h1>
                <p className="worker-category-badge">{worker.category}</p>
                <div className={`availability-status ${getAvailabilityClass(worker.availability)}`}>
                  <span className="status-dot"></span>
                  {getAvailabilityText(worker.availability)}
                </div>
              </div>
            </div>

            <div className="worker-stats-grid">
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div>
                  <span className="stat-value">₹{worker.hourly_rate}</span>
                  <span className="stat-label">Per Day</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📍</span>
                <div>
                  <span className="stat-value">{worker.location}</span>
                  <span className="stat-label">Location</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <div>
                  <span className="stat-value">{worker.rating || '4.5'}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📞</span>
                <div>
                  <span className="stat-value">{worker.phone}</span>
                  <span className="stat-label">Contact</span>
                </div>
              </div>
            </div>

            {worker.bio && (
              <div className="worker-bio">
                <h3>About</h3>
                <p>{worker.bio}</p>
              </div>
            )}

            {worker.skills && (
              <div className="worker-skills">
                <h3>Skills</h3>
                <div className="skills-list">
                  {worker.skills.split(',').map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="worker-sidebar">
            <div className="booking-card">
              <h3>Book This Worker</h3>
              <p>Get professional help for your project</p>
              
              <div className="price-display">
                <span className="price">₹{worker.hourly_rate}</span>
                <span className="price-unit">/day</span>
              </div>

              <button 
                className="btn btn-primary btn-lg btn-block"
                onClick={() => setShowBookingModal(true)}
                disabled={worker.availability !== 'available'}
              >
                {worker.availability === 'available' 
                  ? 'Book Now' 
                  : worker.availability === 'busy' 
                    ? '🚫 Currently Unavailable' 
                    : '⚫ Currently Offline'}
              </button>

              <div className="booking-features">
                <div className="feature">✓ Verified Profile</div>
                <div className="feature">✓ Secure Booking</div>
                <div className="feature">✓ Direct Contact</div>
              </div>
            </div>

            {worker.aadhaar_verified && (
              <div className="trust-card">
                <h4>Trust & Safety</h4>
                <div className="trust-item verified">
                  <span>✅</span>
                  <div>
                    <strong>Aadhaar Verified</strong>
                    <p>Identity verified through Aadhaar</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal 
          worker={worker} 
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}

export default WorkerDetail



