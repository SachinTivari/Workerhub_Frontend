import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Frown, IndianRupee, MapPin, Star, Phone, ShieldCheck, Ban, Check, Shield } from 'lucide-react'
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
            <div className="icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'rgba(255,255,255,0.4)' }}>
              <Frown size={64} />
            </div>
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
                <span className="stat-icon bg-gradient-green"><IndianRupee size={24} /></span>
                <div>
                  <span className="stat-value">₹{worker.daily_rate}</span>
                  <span className="stat-label">Per Day</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon bg-gradient-blue"><MapPin size={24} /></span>
                <div>
                  <span className="stat-value">{worker.location}</span>
                  <span className="stat-label">Location</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon bg-gradient-orange"><Star size={24} /></span>
                <div>
                  <span className="stat-value">{worker.rating || '4.5'}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon bg-gradient-purple"><Phone size={24} /></span>
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
                <span className="price">₹{worker.daily_rate}</span>
                <span className="price-unit">/day</span>
              </div>

              <button 
                className="btn btn-primary btn-lg btn-block"
                onClick={() => setShowBookingModal(true)}
                disabled={worker.availability !== 'available'}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {worker.availability === 'available' 
                  ? 'Book Now' 
                  : worker.availability === 'busy' 
                    ? <><Ban size={18} /> Currently Unavailable</> 
                    : <><div className="status-dot offline-dot" style={{width: '10px', height: '10px'}}></div> Currently Offline</>}
              </button>

              <div className="booking-features">
                <div className="feature"><Check size={16} /> Verified Profile</div>
                <div className="feature"><Shield size={16} /> Secure Booking</div>
                <div className="feature"><Phone size={16} /> Direct Contact</div>
              </div>
            </div>

            {worker.aadhaar_verified && (
              <div className="trust-card">
                <h4>Trust & Safety</h4>
                <div className="trust-item verified">
                  <span><ShieldCheck size={24} color="#00e676" /></span>
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



