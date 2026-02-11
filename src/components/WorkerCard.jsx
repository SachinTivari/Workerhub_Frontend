import { Link } from 'react-router-dom'
import './WorkerCard.css'

function WorkerCard({ worker }) {
  const getAvailabilityClass = (availability) => {
    switch (availability) {
      case 'available': return 'badge-available'
      case 'busy': return 'badge-busy'
      default: return 'badge-offline'
    }
  }

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available': return 'Available'
      case 'busy': return 'Unavailable'
      default: return 'Offline'
    }
  }

  return (
    <Link to={`/worker/${worker._id || worker.id}`} className="worker-card">
      <div className="worker-card-header">
        <div className="worker-avatar">
          {worker.photo_url ? (
            <img src={worker.photo_url} alt={worker.name} />
          ) : (
            <span>{worker.name?.charAt(0)}</span>
          )}
        </div>
        <span className={`availability-badge ${getAvailabilityClass(worker.availability)}`}>
          {getAvailabilityText(worker.availability)}
        </span>
      </div>
      
      <div className="worker-card-body">
        <h3 className="worker-name">{worker.name}</h3>
        <p className="worker-category">{worker.category}</p>
        
        <div className="worker-details">
          <div className="detail-item">
            <span className="icon">💰</span>
            <span>₹{worker.hourly_rate}/day</span>
          </div>
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>{worker.location}</span>
          </div>
          <div className="detail-item">
            <span className="icon">⭐</span>
            <span>{worker.rating || '4.5'}</span>
          </div>
        </div>

        {worker.aadhaar_verified && (
          <div className="verified-badge">
            <span>✅</span> Aadhaar Verified
          </div>
        )}
      </div>
      
      <div className="worker-card-footer">
        <span className="view-profile">View Profile →</span>
      </div>
    </Link>
  )
}

export default WorkerCard



