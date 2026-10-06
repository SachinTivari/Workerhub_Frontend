import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  HardHat, 
  CalendarCheck, 
  IndianRupee, 
  UserPlus,
  Activity,
  AlertOctagon
} from 'lucide-react';
import { API_URL } from '../../config';
import './Admin.css';

function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    revenue: '₹0',
    pendingWorkers: 0,
    activeBookings: 0,
    complaints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/stats`);
        setStatsData(res.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { id: 1, title: 'Users', value: statsData.totalUsers, icon: Users, color: 'bg-gradient-blue' },
    { id: 2, title: 'Workers', value: statsData.totalWorkers, icon: HardHat, color: 'bg-gradient-purple' },
    { id: 3, title: 'Bookings', value: statsData.totalBookings, icon: CalendarCheck, color: 'bg-gradient-teal' },
    { id: 4, title: 'Revenue', value: statsData.revenue, icon: IndianRupee, color: 'bg-gradient-green' },
    { id: 5, title: 'Pending Workers', value: statsData.pendingWorkers, icon: UserPlus, color: 'bg-gradient-orange' },
    { id: 6, title: 'Active Bookings', value: statsData.activeBookings, icon: Activity, color: 'bg-gradient-pink' },
    { id: 7, title: 'Complaints', value: statsData.complaints, icon: AlertOctagon, color: 'bg-gradient-red' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="admin-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="admin-stat-card">
                <div className={`stat-icon-wrapper ${stat.color}`}>
                  <Icon size={28} />
                </div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <div className="stat-value">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
