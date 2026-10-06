import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import logo from '../assets/logo.png'
import NotificationBell from './NotificationBell'
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
          <img src={logo} alt="WorkerHub" style={{ height: '65px', width: 'auto' }} />
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
          
          {user ? (
            <li className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <NotificationBell userId={user.id || user._id} isWorker={false} />
              <Link to="/user/dashboard" className="user-info" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="user-avatar">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.name} />
                  ) : (
                    user.name?.charAt(0)
                  )}
                </span>
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="auth-buttons">
              <Link to="/register" className="btn btn-secondary btn-sm">
                Join as Worker
              </Link>
              <Link to="/get-started" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar






