import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { IndianRupee, Wallet, Clock, TrendingUp, Filter } from 'lucide-react'
import './AdminPayments.css'

function AdminPayments() {
  const [data, setData] = useState({
    stats: { totalRevenue: 0, platformRevenue: 0, pendingAmount: 0, totalCompletedBookings: 0 },
    bookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/payments`)
      setData(res.data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading financials...</div>
  }

  return (
    <div className="admin-payments">
      <div className="admin-page-header">
        <h1>Payments & Revenue</h1>
        <p>Overview of all transactions and platform earnings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Platform Revenue</h3>
            <p className="stat-value text-success">₹{data.stats.platformRevenue}</p>
            <p className="stat-desc">From completed & paid bookings</p>
          </div>
          <div className="stat-icon success">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Gross Revenue Processed</h3>
            <p className="stat-value">₹{data.stats.totalRevenue}</p>
            <p className="stat-desc">Total money moved (incl. worker pay)</p>
          </div>
          <div className="stat-icon primary">
            <Wallet size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Payments</h3>
            <p className="stat-value text-warning">₹{data.stats.pendingAmount}</p>
            <p className="stat-desc">Awaiting customer payment</p>
          </div>
          <div className="stat-icon warning">
            <Clock size={28} />
          </div>
        </div>
      </div>

      <div className="admin-content-card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Worker</th>
                <th>Customer</th>
                <th>Amount (₹)</th>
                <th>Fee (₹)</th>
                <th>Total (₹)</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td>{booking.worker_id?.name || 'Unknown'}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.service_amount}</td>
                  <td className="text-success">+{booking.platform_fee}</td>
                  <td style={{ fontWeight: 'bold' }}>{booking.total_amount}</td>
                  <td>
                    {booking.payment_method !== 'none' 
                      ? booking.payment_method.toUpperCase() 
                      : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${booking.payment_status}`}>
                      {booking.payment_status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {data.bookings.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)' }}>
                    No completed transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPayments
