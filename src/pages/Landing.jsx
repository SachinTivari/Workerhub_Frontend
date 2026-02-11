import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
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
          <div className="landing-logo">
            <span className="logo-icon">👷</span>
            <span className="logo-text">WorkerHub</span>
          </div>
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
              <div className="role-icon-wrapper">
                <span className="role-icon">🔧</span>
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
              <div className="role-icon-wrapper">
                <span className="role-icon">👤</span>
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

            {/* Guest Card */}
            <Link to="/home" className="role-card guest-card">
              <div className="role-icon-wrapper">
                <span className="role-icon">👁️</span>
              </div>
              <h3>Just Browsing</h3>
              <p>Explore available workers and services</p>
              <ul className="role-benefits">
                <li>✅ View all workers</li>
                <li>✅ Check availability</li>
                <li>✅ See rates & skills</li>
                <li>✅ Register later</li>
              </ul>
              <div className="role-cta">
                Continue as Guest
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

