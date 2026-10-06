import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn } from 'lucide-react'
import logo from '../assets/logo.png'
import './Auth.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()

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
      const res = await axios.post(`${API_URL}/api/auth/login`, formData)
      
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
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
      alert(`${provider} login coming soon!`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="WorkerHub Logo" className="auth-logo" />
          <h1>Welcome Back</h1>
          <p>Login to continue booking workers</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>

        <div className="social-divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button 
            className="social-btn google"
            onClick={() => handleSocialLogin('Google')}
          >
            <span className="social-icon">🔵</span>
            Google
          </button>
          <button 
            className="social-btn facebook"
            onClick={() => handleSocialLogin('Facebook')}
          >
            <span className="social-icon">📘</span>
            Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login



