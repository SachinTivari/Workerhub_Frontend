import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../config'
import { Calendar, CreditCard, User, LogOut, CheckCircle, Clock, XCircle, AlertTriangle, X, Star, IndianRupee } from 'lucide-react'
import './UserDashboard.css'

function UserDashboard() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Handlers moved to UserBookings.jsx

  if (loading) {
    return (
      <div className="user-dashboard-page">
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.7)' }}>
          Loading your dashboard...
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
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {user?.name}!</h1>
        </div>
        <div className="header-right">
          {user?.photo_url && (
            <img
              src={user.photo_url}
              alt="Profile"
              className="profile-pic"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          )}
          <div
            className="profile-fallback"
            style={{ display: user?.photo_url ? 'none' : 'flex' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button className="btn-action" onClick={() => {
            localStorage.removeItem('user')
            navigate('/login')
          }} style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <p className="stat-value">{bookings.length}</p>
          </div>
          <div className="stat-icon">
            <Calendar size={28} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Services</h3>
            <p className="stat-value">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="stat-icon warning">
            <Clock size={28} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Completed</h3>
            <p className="stat-value">{bookings.filter(b => b.status === 'completed').length}</p>
          </div>
          <div className="stat-icon success">
            <CheckCircle size={28} />
          </div>
        </div>
      </div>

      <div className="bookings-section">
        <h2>Your Bookings</h2>
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
                {bookings.slice(0, 3).map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="worker-info">
                        <p>{booking.worker_name || booking.worker_id?.name || 'Worker (Deleted)'}</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="btn-issue"
                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
                            onClick={() => navigate('/user/bookings')}
                          >
                            View Details in Bookings
                          </button>
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

    </div>
  )
}

export default UserDashboard
