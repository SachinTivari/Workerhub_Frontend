import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HardHat, 
  Briefcase, 
  List, 
  CalendarCheck, 
  CreditCard, 
  Star, 
  AlertCircle, 
  Tag, 
  Bell, 
  Settings,
  LogOut
} from 'lucide-react';
import logo from '../assets/logo.png';
import './AdminLayout.css';

const navItems = [
  { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/customers', name: 'Customers', icon: Users },
  { path: '/admin/workers', name: 'Workers', icon: HardHat },
  { path: '/admin/services', name: 'Services', icon: Briefcase },
  { path: '/admin/categories', name: 'Categories', icon: List },
  { path: '/admin/bookings', name: 'Bookings', icon: CalendarCheck },
  { path: '/admin/payments', name: 'Payments', icon: CreditCard },
  { path: '/admin/reviews', name: 'Reviews', icon: Star },
  { path: '/admin/complaints', name: 'Complaints', icon: AlertCircle },
  { path: '/admin/offers', name: 'Offers/Coupons', icon: Tag },
  { path: '/admin/notifications', name: 'Notifications', icon: Bell },
  { path: '/admin/settings', name: 'Settings', icon: Settings },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/">
            <img src={logo} alt="WorkerHub" />
          </Link>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-title">
            <h2>Admin Control Panel</h2>
          </div>
          <div className="admin-header-actions">
            <div className="admin-profile">
              <div className="admin-avatar">A</div>
              <span>Admin</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ padding: '8px 15px' }}>
              <LogOut size={16} style={{ marginRight: '5px' }}/> Logout
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
