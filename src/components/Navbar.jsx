import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/home" className="navbar-brand">
          <span className="brand-icon">👷</span>
          <span className="brand-text">WorkerHub</span>
        </Link>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <Link to="/home" className={isActive('/home') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/workers" className={isActive('/workers') ? 'active' : ''}>
              Find Workers
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/bookings" className={isActive('/bookings') ? 'active' : ''}>
                My Bookings
              </Link>
            </li>
          )}
          <li>
            <Link to="/register" className={isActive('/register') ? 'active' : ''}>
              Register as Worker
            </Link>
          </li>
          
          {user ? (
            <li className="user-menu">
              <div className="user-info">
                <span className="user-avatar">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.name} />
                  ) : (
                    user.name?.charAt(0)
                  )}
                </span>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar






