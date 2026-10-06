import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import AdminLayout from '../../components/AdminLayout'
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Search, XCircle } from 'lucide-react'
import './Admin.css'

function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/complaints`)
      setComplaints(res.data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this complaint as ${newStatus.replace('_', ' ')}?`)) return
    
    setUpdating(true)
    try {
      await axios.put(`${API_URL}/api/complaints/${id}/status`, { status: newStatus })
      fetchComplaints()
    } catch (error) {
      console.error('Error updating complaint status:', error)
      alert('Failed to update complaint status')
    } finally {
      setUpdating(false)
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.booking_id?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.worker_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issue?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle size={16} />
      case 'in_progress': return <Clock size={16} />
      default: return <AlertTriangle size={16} />
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Complaints Management">
        <div className="loading-state">Loading complaints...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Complaints Management">
      <div className="admin-content">
        
        {/* Stats Summary */}
        <div className="stats-grid" style={{ marginBottom: '30px' }}>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Complaints</h3>
              <p className="stat-value">{complaints.length}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Open Issues</h3>
              <p className="stat-value">{complaints.filter(c => c.status === 'open').length}</p>
            </div>
            <div className="stat-icon warning">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Resolved</h3>
              <p className="stat-value">{complaints.filter(c => c.status === 'resolved').length}</p>
            </div>
            <div className="stat-icon success">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder="Search by ID, User, Worker, or Issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px 12px 45px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff'
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                minWidth: '150px'
              }}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="table-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer / Worker</th>
                <th>Issue Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(complaint => (
                  <tr key={complaint._id}>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                        #{complaint.booking_id?._id?.substring(0, 8) || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div><strong style={{color: '#fff'}}>User:</strong> {complaint.user_id?.name || 'Unknown'}</div>
                      <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '4px'}}>
                        <strong>Worker:</strong> {complaint.worker_id?.name || 'Deleted'}
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#fca5a5', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {complaint.issue}
                      </span>
                    </td>
                    <td style={{ maxWidth: '250px' }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem', 
                        color: 'rgba(255,255,255,0.8)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }} title={complaint.description}>
                        {complaint.description}
                      </p>
                    </td>
                    <td>
                      <span className={`status-badge ${complaint.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                        {complaint.status !== 'resolved' && (
                          <button 
                            className="btn-action success"
                            onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                            disabled={updating}
                            title="Mark as Resolved"
                            style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {complaint.status === 'open' && (
                          <button 
                            className="btn-action warning"
                            onClick={() => handleStatusUpdate(complaint._id, 'in_progress')}
                            disabled={updating}
                            title="Mark In Progress"
                            style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          >
                            <Clock size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  )
}

export default AdminComplaints
