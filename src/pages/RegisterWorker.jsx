import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import './RegisterWorker.css'

function RegisterWorker() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
    hourly_rate: '',
    location: '',
    bio: '',
    skills: '',
    aadhaar_number: '',
    availability: 'available'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`)
      setCategories(res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate Aadhaar if provided
    if (formData.aadhaar_number && !validateAadhaar(formData.aadhaar_number)) {
      setError('Aadhaar number must be exactly 12 digits')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/api/workers`, formData)
      // Auto-login after registration
      localStorage.setItem('worker', JSON.stringify(res.data.worker))
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="register-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Registration Successful!</h2>
            <p>Your profile has been created. You can now manage your availability.</p>
            <div className="success-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/worker-dashboard')}
              >
                Go to Dashboard
              </button>
              <Link to="/home" className="btn btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-card">
          <div className="register-header">
            <h1>Register as Worker</h1>
            <p>Join our platform and start getting bookings today</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email (optional)"
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Area"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Aadhaar Number (for verification)</label>
                <input
                  type="text"
                  name="aadhaar_number"
                  value={formData.aadhaar_number}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength="12"
                />
                <span className="input-hint">Your Aadhaar will be verified for trust badge</span>
              </div>
            </div>

            <div className="form-section">
              <h3>Account Security</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              <span className="input-hint">Password must be at least 6 characters. You'll use this to login later.</span>
            </div>

            <div className="form-section">
              <h3>Work Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your category</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Daily Rate (₹) *</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    placeholder="Enter daily rate"
                    min="200"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Brick laying, Plastering, Tile work"
                />
                <span className="input-hint">Separate skills with commas</span>
              </div>

              <div className="form-group">
                <label>About You</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell customers about your experience..."
                  rows="4"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Registering...' : 'Register Now'}
            </button>

            <div className="form-footer">
              <p>Already registered? <Link to="/worker-login">Login to your account</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterWorker



