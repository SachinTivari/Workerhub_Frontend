import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import WorkerCard from '../components/WorkerCard'
import { API_URL } from '../config'
import './Workers.css'

function Workers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [workers, setWorkers] = useState([])
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationSearch, setLocationSearch] = useState(searchParams.get('location') || '')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const locationRef = useRef(null)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    availability: searchParams.get('availability') || '',
    location: searchParams.get('location') || ''
  })

  useEffect(() => {
    fetchCategories()
    fetchLocations()
  }, [])

  // Close location suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/locations`)
      setLocations(res.data)
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const fetchWorkers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.availability) params.append('availability', filters.availability)
      if (filters.location) params.append('location', filters.location)
      
      const res = await axios.get(`${API_URL}/api/workers?${params}`)
      setWorkers(res.data)
    } catch (error) {
      console.error('Error fetching workers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Update URL params
    const params = {}
    if (newFilters.category) params.category = newFilters.category
    if (newFilters.location) params.location = newFilters.location
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({ category: '', availability: '', location: '' })
    setLocationSearch('')
    setSearchParams({})
  }

  const handleLocationSearch = (value) => {
    setLocationSearch(value)
    setShowLocationSuggestions(true)
    // Apply filter after typing stops (debounce effect)
    if (value.length >= 2 || value === '') {
      handleFilterChange('location', value)
    }
  }

  const selectLocation = (loc) => {
    setLocationSearch(loc)
    handleFilterChange('location', loc)
    setShowLocationSuggestions(false)
  }

  const filteredLocations = locations.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  )

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
          <div className="filters-grid">
            <div className="filter-group" ref={locationRef}>
              <label>📍 Location</label>
              <div className="location-filter-wrapper">
                <span className="location-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={locationSearch}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                />
                {showLocationSuggestions && filteredLocations.length > 0 && (
                  <div className="location-suggestions">
                    <div 
                      className="location-suggestion-item"
                      onClick={() => selectLocation('')}
                    >
                      📍 All Locations
                    </div>
                    {filteredLocations.map((loc, index) => (
                      <div 
                        key={index} 
                        className={`location-suggestion-item ${filters.location === loc ? 'active' : ''}`}
                        onClick={() => selectLocation(loc)}
                      >
                        📍 {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-group">
              <label>💼 Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>🟢 Availability</label>
              <select 
                value={filters.availability} 
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="available">✅ Available Now</option>
                <option value="busy">🔴 Busy</option>
                <option value="offline">⚫ Offline</option>
              </select>
            </div>

            <button className="btn btn-secondary clear-btn" onClick={clearFilters}>
              ✕ Clear Filters
            </button>
          </div>

          <div className="results-count">
            Found <span>{workers.length}</span> workers
            {filters.location && ` in ${filters.location}`}
            {filters.category && ` • ${filters.category}`}
            {filters.availability && ` • ${filters.availability === 'available' ? 'Available' : filters.availability === 'busy' ? 'Busy' : 'Offline'}`}
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



