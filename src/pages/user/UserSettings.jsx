import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Save, X } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../../config'
import './UserDashboard.css'

function UserSettings() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    setFormData({
      name: parsedUser.name || '',
      phone: parsedUser.phone || '',
      location: parsedUser.location?.address || ''
    })
  }, [navigate])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing && user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location?.address || ''
      })
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const userId = user.id || user._id;
      const res = await axios.patch(`${API_URL}/api/users/${userId}`, {
        name: formData.name,
        phone: formData.phone,
        location: { address: formData.location }
      })
      
      const updatedUser = res.data.user
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Profile Settings</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>View and manage your account details.</p>
        </div>
      </div>

      <div className="bookings-section" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Personal Information</h2>
          {!isEditing ? (
            <button className="btn-submit" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: 'auto', padding: '8px 16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.9rem' }} onClick={handleEditToggle}>
              Edit Profile
            </button>
          ) : (
            <button className="btn-submit" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', width: 'auto', padding: '8px 16px', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={handleEditToggle}>
              <X size={16} /> Cancel
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Name */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '50%', color: '#a5b4fc' }}>
              <User size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Full Name</p>
              {isEditing ? (
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{user.name}</p>
              )}
            </div>
          </div>
          
          {/* Email (Read only usually) */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', opacity: isEditing ? 0.7 : 1 }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '50%', color: '#a5b4fc' }}>
              <Mail size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Email Address (Cannot be changed)</p>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '50%', color: '#a5b4fc' }}>
              <Phone size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Phone Number</p>
              {isEditing ? (
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{user.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '50%', color: '#a5b4fc' }}>
              <MapPin size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Location</p>
              {isEditing ? (
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{user.location?.address || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
            <button 
              className="btn-submit" 
              style={{ background: '#4f46e5', color: 'white', flex: 1, padding: '12px 24px', cursor: 'pointer', border: 'none', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} 
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserSettings
