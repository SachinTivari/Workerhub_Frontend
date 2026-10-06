import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Wrench, User } from 'lucide-react'
import logo from '../assets/logo.png'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'worker') navigate('/worker-dashboard')
      else navigate('/user/dashboard')
    }
  }, [navigate])

  return (
    <div className="landing-page">
      {/* Background Animation */}
      <div className="landing-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
      </div>

      <div className="landing-container">
        {/* Logo & Title */}
        <div className="landing-header">
          <img src={logo} alt="WorkerHub Logo" className="landing-logo-img" style={{ height: '100px', width: 'auto', marginBottom: '20px', display: 'block', margin: '0 auto 20px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }} />
          <h1 className="landing-title">
            Connect. Work. <span>Earn.</span>
          </h1>
          <p className="landing-subtitle">
            India's #1 platform connecting skilled workers with customers
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="role-selection">
          <h2 className="selection-title">I am a...</h2>
          
          <div className="role-cards">
            {/* Worker Card */}
            <Link to="/register" className="role-card worker-card">
              <div className="role-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white' }}>
                <Wrench size={32} />
              </div>
              <h3>Skilled Worker</h3>
              <p>Mason, Carpenter, Plumber, Electrician, Painter, Helper</p>
              <ul className="role-benefits">
                <li>✅ Get direct job bookings</li>
                <li>✅ Set your own rates</li>
                <li>✅ Build your reputation</li>
                <li>✅ Free registration</li>
              </ul>
              <div className="role-cta">
                Register as Worker
                <span className="arrow">→</span>
              </div>
            </Link>

            {/* User Card */}
            <Link to="/signup" className="role-card user-card">
              <div className="role-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white' }}>
                <User size={32} />
              </div>
              <h3>Customer / User</h3>
              <p>Looking to hire skilled workers for your projects</p>
              <ul className="role-benefits">
                <li>✅ Find verified workers</li>
                <li>✅ Book instantly</li>
                <li>✅ Compare rates & reviews</li>
                <li>✅ Track your bookings</li>
              </ul>
              <div className="role-cta">
                Register as User
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Already have account */}
        <div className="landing-footer">
          <p>Already have an account?</p>
          <div className="login-links">
            <Link to="/login" className="login-link user-login">
              <span>👤</span> User Login
            </Link>
            <span className="divider">|</span>
            <Link to="/worker-login" className="login-link worker-login">
              <span>🔧</span> Worker Login
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="landing-stats">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Workers</span>
          </div>
          <div className="stat">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Jobs Done</span>
          </div>
          <div className="stat">
            <span className="stat-number">6</span>
            <span className="stat-label">Services</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing

