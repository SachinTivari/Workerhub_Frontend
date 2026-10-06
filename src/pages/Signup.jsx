import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import logo from '../assets/logo.png'
import './Auth.css'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' // default role
  })
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()

  // Strict regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[6-9]\d{9}$/ // Indian phone number format

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    // Validate email
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate phone
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian phone number (starting with 6-9)')
      return
    }

    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, formData)
      
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (error) {
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg || 
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignup = async (provider) => {
    if (provider === 'Google') {
      try {
        setLoading(true)
        setError('')
        
        const result = await loginWithGoogle()
        const user = result.user
        
        const res = await axios.post(`${API_URL}/api/auth/google`, {
          name: user.displayName,
          email: user.email,
          photo_url: user.photoURL
        })
        
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      } catch (error) {
        console.error('Google Auth Error:', error)
        setError('Failed to authenticate with Google')
      } finally {
        setLoading(false)
      }
    } else {
      alert(`${provider} signup coming soon!`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="WorkerHub Logo" className="auth-logo" />
          <h1>Create Account</h1>
          <p>Sign up to start booking skilled workers</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
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

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="social-divider">
          <span>or sign up with</span>
        </div>

        <div className="social-buttons">
          <button 
            className="social-btn google"
            onClick={() => handleSocialSignup('Google')}
          >
            <span className="social-icon">🔵</span>
            Google
          </button>
          <button 
            className="social-btn facebook"
            onClick={() => handleSocialSignup('Facebook')}
          >
            <span className="social-icon">📘</span>
            Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup



