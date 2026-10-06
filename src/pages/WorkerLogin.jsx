import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn } from 'lucide-react'
import logo from '../assets/logo.png'
import './Auth.css'

function WorkerLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuth()

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
      const res = await axios.post(`${API_URL}/api/workers/login`, formData)
      
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('worker', JSON.stringify(res.data.worker))
      login(res.data.worker)
      navigate('/worker-dashboard')
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="WorkerHub Logo" className="auth-logo" />
          <h1>Worker Login</h1>
          <p>Login to manage your profile and bookings</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your registered phone"
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
            <Link to="/worker-forgot-password">Forgot Password?</Link>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register as Worker</Link></p>
          <p className="mt-2">Are you a customer? <Link to="/login">User Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default WorkerLogin

