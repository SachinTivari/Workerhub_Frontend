import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  ClipboardList, CheckCircle, Award, IndianRupee, 
  Phone, Mail, Briefcase, MapPin, Star, ShieldCheck, 
  Calendar, Clock, FileText, Check, X,
  User, LayoutDashboard
} from 'lucide-react'
import { API_URL } from '../config'
import NotificationBell from '../components/NotificationBell'
import './WorkerDashboard.css'

function WorkerDashboard() {
  const navigate = useNavigate()
  const [worker, setWorker] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const storedWorker = localStorage.getItem('worker')
    if (!storedWorker) {
      navigate('/worker-login')
      return
    }
    const workerData = JSON.parse(storedWorker)
    setWorker(workerData)
    fetchLatestWorker(workerData.id || workerData._id)
    fetchBookings(workerData.id || workerData._id)
  }, [navigate])

  const fetchLatestWorker = async (workerId) => {
    try {
      const res = await axios.get(`${API_URL}/api/workers/${workerId}`)
      if (res.data) {
        setWorker(res.data)
        localStorage.setItem('worker', JSON.stringify(res.data))
      }
    } catch (error) {
      console.error('Error fetching worker data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      const workerId = worker.id || worker._id;
      const res = await axios.patch(`${API_URL}/api/workers/${workerId}`, {
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
      const workerId = worker.id || worker._id;
      fetchBookings(workerId)
      // If completed or cancelled, availability will be updated by backend
      if (status === 'completed' || status === 'cancelled') {
        const res = await axios.get(`${API_URL}/api/workers/${workerId}`)
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
      <div className="worker-dash-header">
        <div className="container">
          <div className="worker-header-content">
            <div className="worker-profile-info">
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
                <p className="worker-location"><MapPin size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> {worker.location}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px', color: '#fcd34d' }}>
                  <Star size={16} fill="#fcd34d" /> 
                  <span style={{ fontWeight: 'bold' }}>{worker.rating || 0}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginLeft: '5px' }}>({worker.total_reviews || 0} Reviews)</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <NotificationBell userId={worker.id || worker._id} isWorker={true} />
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container worker-dashboard-content">
        {activeTab === 'dashboard' && (
          <>
        {/* Quick Stats */}
        <div className="worker-stats-grid">
          <div className="worker-stat-card">
            <span className="worker-stat-icon bg-gradient-orange"><ClipboardList size={28} /></span>
            <div className="worker-stat-info">
              <span className="worker-stat-number">{pendingBookings.length}</span>
              <span className="worker-stat-label">Pending</span>
            </div>
          </div>
          <div className="worker-stat-card">
            <span className="worker-stat-icon bg-gradient-blue"><CheckCircle size={28} /></span>
            <div className="worker-stat-info">
              <span className="worker-stat-number">{confirmedBookings.length}</span>
              <span className="worker-stat-label">Confirmed</span>
            </div>
          </div>
          <div className="worker-stat-card">
            <span className="worker-stat-icon bg-gradient-teal"><Award size={28} /></span>
            <div className="worker-stat-info">
              <span className="worker-stat-number">{completedBookings.length}</span>
              <span className="worker-stat-label">Completed</span>
            </div>
          </div>
          <div className="worker-stat-card">
            <span className="worker-stat-icon bg-gradient-green"><IndianRupee size={28} /></span>
            <div className="worker-stat-info">
              <span className="worker-stat-number">₹{worker.daily_rate}</span>
              <span className="worker-stat-label">Per Day</span>
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
              <span className="avail-icon"><div className="status-dot available-dot"></div></span>
              <span>Available</span>
            </button>
            <button 
              className={`avail-btn busy ${worker.availability === 'busy' ? 'active' : ''}`}
              onClick={() => updateAvailability('busy')}
              disabled={updating}
            >
              <span className="avail-icon"><div className="status-dot busy-dot"></div></span>
              <span>Busy</span>
            </button>
            <button 
              className={`avail-btn offline ${worker.availability === 'offline' ? 'active' : ''}`}
              onClick={() => updateAvailability('offline')}
              disabled={updating}
            >
              <span className="avail-icon"><div className="status-dot offline-dot"></div></span>
              <span>Offline</span>
            </button>
          </div>
          {updating && <p className="updating-text">Updating...</p>}
        </div>
          </>
        )}

        {/* Tabs */}
        <div className="worker-dashboard-tabs bottom-nav-menu">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} className="nav-icon" />
            <span>Dashboard</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={20} className="nav-icon" />
            <span>Bookings</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} className="nav-icon" />
            <span>Profile</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-card">
              <h3>Profile Information</h3>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="label"><Phone size={16} /> Phone</span>
                  <span className="value">{worker.phone}</span>
                </div>
                {worker.email && (
                  <div className="detail-row">
                    <span className="label"><Mail size={16} /> Email</span>
                    <span className="value">{worker.email}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label"><Briefcase size={16} /> Category</span>
                  <span className="value">{worker.category}</span>
                </div>
                <div className="detail-row">
                  <span className="label"><IndianRupee size={16} /> Daily Rate</span>
                  <span className="value">₹{worker.daily_rate}</span>
                </div>
                <div className="detail-row">
                  <span className="label"><MapPin size={16} /> Location</span>
                  <span className="value">{worker.location || 'Not set'}</span>
                </div>
                <div className="detail-row">
                  <span className="label"><Star size={16} /> Rating</span>
                  <span className="value">{worker.rating || '4.5'} / 5</span>
                </div>
                {worker.aadhaar_verified && (
                  <div className="detail-row verified">
                    <span className="label"><ShieldCheck size={16} /> Aadhaar</span>
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
          <div className="worker-bookings-section">
            {bookings.length === 0 ? (
              <div className="empty-state">
                <div className="icon"><ClipboardList size={48} /></div>
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
                        <p><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> {booking.customer_phone}</p>
                      </div>
                      <span className={`booking-status ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="detail">
                        <span><Calendar size={16} /></span>
                        <span>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="detail">
                        <span><Clock size={16} /></span>
                        <span>{booking.booking_time}</span>
                      </div>
                      <div className="detail">
                        <span><MapPin size={16} /></span>
                        <span>{booking.address}</span>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="booking-notes">
                        <p><FileText size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}/> {booking.notes}</p>
                      </div>
                    )}
                    {booking.status === 'pending' && (
                      <div className="booking-actions">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Check size={16} /> Accept
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <X size={16} /> Decline
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="booking-actions">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => updateBookingStatus(booking._id, 'completed')}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Award size={16} /> Mark Completed
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

