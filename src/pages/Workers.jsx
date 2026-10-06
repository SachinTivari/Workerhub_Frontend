import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import WorkerCard from '../components/WorkerCard'
import { API_URL } from '../config'
import './Workers.css'

function Workers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [workers, setWorkers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    availability: searchParams.get('availability') || '',
    location: searchParams.get('location') || ''
  })

  useEffect(() => {
    fetchCategories()
    
    // Auto-detect location if none provided in URL
    if (!filters.location) {
      const detectLocation = async () => {
        try {
          const ipRes = await fetch('https://ipapi.co/json/')
          const ipData = await ipRes.json()
          if (ipData.city) {
            handleFilterChange('location', ipData.city)
          }
        } catch (err) {
          console.error("Location detection failed:", err)
        }
      }
      detectLocation()
    }
  }, [])

  useEffect(() => {
    fetchWorkers()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`)
      setCategories(res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchWorkers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.availability) params.append('availability', filters.availability)
      
      const res = await axios.get(`${API_URL}/api/workers?${params}`)
      let fetchedWorkers = res.data
      
      // Filter by location on frontend since backend may not support location query
      if (filters.location) {
        fetchedWorkers = fetchedWorkers.filter(w => 
          w.location && w.location.toLowerCase().includes(filters.location.toLowerCase())
        )
      }
      
      setWorkers(fetchedWorkers)
    } catch (error) {
      console.error('Error fetching workers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({ category: '', availability: '', location: '' })
    setSearchParams({})
  }

  return (
    <div className="workers-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Find Skilled Workers</h1>
          <p className="page-subtitle">
            Browse through our list of verified and skilled workers
          </p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          {/* Location Filter */}
          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Enter city or area"
              className="location-input"
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                marginBottom: '20px'
              }}
            />
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Availability</label>
              <select 
                value={filters.availability} 
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">All</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <button className="btn btn-secondary clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="results-count">
            Found <span>{workers.length}</span> workers
            {filters.category && ` in ${filters.category}`}
          </div>
        </div>

        {/* Workers Grid */}
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        ) : workers.length > 0 ? (
          <div className="workers-grid grid grid-4">
            {workers.map((worker) => (
              <WorkerCard key={worker._id || worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No workers found</h3>
            <p>Try adjusting your filters or check back later</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Workers



