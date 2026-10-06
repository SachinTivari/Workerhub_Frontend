import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import WorkerCard from '../components/WorkerCard'
import { API_URL } from '../config'
import logo from '../assets/logo.png'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [featuredWorkers, setFeaturedWorkers] = useState([])
  const [serviceCounts, setServiceCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [expandedService, setExpandedService] = useState(null)

  // Main services
  const services = [
    { name: 'Mason', icon: '🧱', color: '#e74c3c', description: 'Brick & Construction' },
    { name: 'Carpenter', icon: '🪚', color: '#8b4513', description: 'Wood & Furniture' },
    { name: 'Electrician', icon: '⚡', color: '#f39c12', description: 'Electrical Work' },
    { name: 'Plumber', icon: '🔧', color: '#3498db', description: 'Pipe & Water' },
    { name: 'Helper', icon: '👷', color: '#9b59b6', description: 'General Labor' },
    { name: 'Painter', icon: '🎨', color: '#1abc9c', description: 'Wall Painting' }
  ]

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'worker') navigate('/worker-dashboard')
      else navigate('/user/dashboard')
      return
    }

    const initData = async () => {
      let detectedLocation = ''
      try {
        const ipRes = await fetch('https://ipapi.co/json/')
        const ipData = await ipRes.json()
        if (ipData.city) {
          detectedLocation = ipData.city
          setSearchLocation(detectedLocation)
        }
      } catch (err) {
        console.error("Location detection failed:", err)
      }
      fetchData(detectedLocation)
    }
    
    initData()
  }, [])

  const fetchData = async (userCity) => {
    try {
      const workersRes = await axios.get(`${API_URL}/api/workers`)
      const workers = workersRes.data
      
      // Count workers by category and availability
      const counts = {}
      services.forEach(service => {
        const categoryWorkers = workers.filter(w => w.category === service.name)
        counts[service.name] = {
          total: categoryWorkers.length,
          available: categoryWorkers.filter(w => w.availability === 'available').length,
          busy: categoryWorkers.filter(w => w.availability === 'busy').length,
          offline: categoryWorkers.filter(w => w.availability === 'offline').length
        }
      })
      setServiceCounts(counts)
      
      // Get featured workers
      let locationWorkers = workers
      if (userCity) {
        const filtered = workers.filter(w => w.location && w.location.toLowerCase().includes(userCity.toLowerCase()))
        // If workers exist in the detected city, show them. Otherwise fallback to all workers.
        if (filtered.length > 0) {
          locationWorkers = filtered
        }
      }
      
      setFeaturedWorkers(locationWorkers.filter(w => w.availability === 'available').slice(0, 4))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchCategory) params.append('category', searchCategory)
    navigate(`/workers?${params.toString()}${searchLocation ? `&location=${searchLocation}` : ''}`)
  }

  const handleServiceClick = (serviceName) => {
    if (expandedService === serviceName) {
      setExpandedService(null)
    } else {
      setExpandedService(serviceName)
    }
  }

  const handleAvailabilityClick = (category, availability) => {
    navigate(`/workers?category=${category}&availability=${availability}`)
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade">
            <span className="hero-badge">🛠️ #1 Worker Hiring Platform</span>
            <h1 className="hero-title">
              Find Skilled <span>Workers</span> Near You
            </h1>
            <p className="hero-description">
              Connect with trusted masons, carpenters, plumbers, electricians and more. 
              Book skilled laborers for any job, big or small.
            </p>
            
            {/* Search Box */}
            <form onSubmit={handleSearch} className="search-box">
              <div className="search-input-group">
                <span className="search-icon">📍</span>
                <input
                  type="text"
                  placeholder="Enter your location (City/Area)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="search-input-group">
                <span className="search-icon">🔧</span>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="search-select"
                >
                  <option value="">Select Category</option>
                  <option value="Mason">Mason</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Helper">Helper</option>
                  <option value="Painter">Painter</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary search-btn">
                🔍 Search
              </button>
            </form>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Skilled Workers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Jobs Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">6</span>
                <span className="stat-label">Services</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="hero-sidebar animate-fade">
            <div className="quick-actions">
              <Link to="/register" className="action-card">
                <span className="action-icon">👷</span>
                <div>
                  <h4>Register as Worker</h4>
                  <p>Join & start earning today</p>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link to="/workers" className="action-card">
                <span className="action-icon">🔍</span>
                <div>
                  <h4>Browse Workers</h4>
                  <p>Find the right worker</p>
                </div>
                <span className="arrow">→</span>
              </Link>
              <Link to="/login" className="action-card highlight">
                <span className="action-icon">🔐</span>
                <div>
                  <h4>Login to Book</h4>
                  <p>Sign in to make bookings</p>
                </div>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Click on any service to see availability
            </p>
          </div>
          
          <div className="services-grid">
            {services.map((service) => (
              <div 
                key={service.name} 
                className={`service-card ${expandedService === service.name ? 'expanded' : ''}`}
                style={{ '--service-color': service.color }}
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="service-icon-wrapper">
                  <span className="service-icon">{service.icon}</span>
                </div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-desc">{service.description}</p>
                
                <div className="service-total">
                  <span className="total-count">{serviceCounts[service.name]?.total || 0}</span>
                  <span className="total-label">Total Workers</span>
                </div>

                {/* Availability Options - Show when expanded */}
                {expandedService === service.name && (
                  <div className="availability-options">
                    <div className="availability-title">Filter by Availability:</div>
                    <button 
                      className="availability-btn available"
                      onClick={(e) => { e.stopPropagation(); handleAvailabilityClick(service.name, 'available'); }}
                    >
                      <span className="avail-icon">🟢</span>
                      <span className="avail-label">Available</span>
                      <span className="avail-count">{serviceCounts[service.name]?.available || 0}</span>
                    </button>
                    <button 
                      className="availability-btn busy"
                      onClick={(e) => { e.stopPropagation(); handleAvailabilityClick(service.name, 'busy'); }}
                    >
                      <span className="avail-icon">🟡</span>
                      <span className="avail-label">Busy Later</span>
                      <span className="avail-count">{serviceCounts[service.name]?.busy || 0}</span>
                    </button>
                    <button 
                      className="availability-btn offline"
                      onClick={(e) => { e.stopPropagation(); handleAvailabilityClick(service.name, 'offline'); }}
                    >
                      <span className="avail-icon">🔴</span>
                      <span className="avail-label">Offline</span>
                      <span className="avail-count">{serviceCounts[service.name]?.offline || 0}</span>
                    </button>
                    <Link 
                      to={`/workers?category=${service.name}`} 
                      className="view-all-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View All {service.name}s →
                    </Link>
                  </div>
                )}

                {expandedService !== service.name && (
                  <div className="click-hint">Click to see availability</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workers Section */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Available Workers</h2>
            <p className="section-subtitle">
              Top-rated workers ready to help you today
            </p>
          </div>
          
          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : featuredWorkers.length > 0 ? (
            <>
              <div className="workers-grid grid grid-4">
                {featuredWorkers.map((worker) => (
                  <WorkerCard key={worker._id || worker.id} worker={worker} />
                ))}
              </div>
              <div className="section-footer">
                <Link to="/workers" className="btn btn-outline btn-lg">
                  View All Workers →
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">👷</div>
              <h3>No workers available yet</h3>
              <p>Browse all workers or check back later</p>
              <Link to="/workers" className="btn btn-primary">
                Find Workers
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple steps to find and book skilled workers
            </p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">🔐</div>
              <h3>Sign Up / Login</h3>
              <p>Create an account or login to get started</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🔍</div>
              <h3>Choose Service</h3>
              <p>Select from Mason, Carpenter, Plumber & more</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">👤</div>
              <h3>View Profiles</h3>
              <p>Check availability, ratings & hourly rates</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">📅</div>
              <h3>Book & Done</h3>
              <p>Book instantly and get work done!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Are You a Skilled Worker?</h2>
              <p>
                Join thousands of workers earning more by connecting with customers. 
                All skilled laborers welcome!
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Register Now - It's Free! 🚀
              </Link>
            </div>
            <div className="cta-features">
              <div className="feature">✅ Free Registration</div>
              <div className="feature">✅ Get Direct Bookings</div>
              <div className="feature">✅ Set Your Own Rates</div>
              <div className="feature">✅ Build Your Reputation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <img src={logo} alt="WorkerHub Logo" style={{ height: '64px', width: 'auto' }} />
              </div>
              <p>India's #1 platform for finding skilled workers for any job, anywhere, anytime.</p>
            </div>
            <div className="footer-links">
              <Link to="/workers">Find Workers</Link>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
              <Link to="/bookings">My Bookings</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 WorkerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home



