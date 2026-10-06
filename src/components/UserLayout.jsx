import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  CalendarCheck, 
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import logo from '../assets/logo.png';
import './AdminLayout.css'; // Reusing admin styles for the sidebar layout

const navItems = [
  { path: '/user/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/user/find-workers', name: 'Find Workers', icon: Search },
  { path: '/user/bookings', name: 'My Bookings', icon: CalendarCheck },
  { path: '/user/settings', name: 'Profile Settings', icon: Settings },
];

function UserLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="admin-layout user-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/user/dashboard">
            <img src={logo} alt="WorkerHub" />
          </Link>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/user/dashboard' && location.pathname.includes(item.path));
            
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
            <h2>User Portal</h2>
          </div>
          <div className="admin-header-actions">
            <div className="admin-profile">
              {user?.photo_url ? (
                <img src={user.photo_url} alt="Profile" className="admin-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={20} />}</div>
              )}
              <span>{user?.name || 'User'}</span>
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

export default UserLayout;
