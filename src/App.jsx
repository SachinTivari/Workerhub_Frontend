import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Workers from './pages/Workers'
import WorkerDetail from './pages/WorkerDetail'
import RegisterWorker from './pages/RegisterWorker'
import WorkerLogin from './pages/WorkerLogin'
import WorkerForgotPassword from './pages/WorkerForgotPassword'
import WorkerDashboard from './pages/WorkerDashboard'
import Bookings from './pages/Bookings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserForgotPassword from './pages/UserForgotPassword'

// Admin Components
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWorkers from './pages/admin/AdminWorkers'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminPayments from './pages/admin/AdminPayments'
import AdminCategories from './pages/admin/AdminCategories'
import AdminServices from './pages/admin/AdminServices'
import AdminBookings from './pages/admin/AdminBookings'
import AdminCustomers from './pages/admin/AdminCustomers'
import UserLayout from './components/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import UserBookings from './pages/user/UserBookings'
import UserSettings from './pages/user/UserSettings'

import './App.css'

// Protected Route Components
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }
  return children
}

function UserRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user || user.role !== 'user') {
    return <Navigate to="/login" replace />
  }
  return children
}

// Layout component to conditionally show Navbar
function Layout({ children }) {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const hiddenNavbarPaths = ['/get-started', '/login', '/signup', '/register', '/worker-login', '/worker-forgot-password', '/worker-dashboard', '/forgot-password']
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user');
  
  // Hide the navbar entirely if the user is logged in, since they have sidebars
  const showNavbar = !user && !isAdminRoute && !isUserRoute && !hiddenNavbarPaths.includes(location.pathname)

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "main-content" : "main-content-full"}>
        {children}
      </main>
    </div>
  )
}

function AdminPlaceholder({ title }) {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>{title}</h1>
        <p>This module is currently under development.</p>
      </div>
      <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Coming Soon 🚀</h2>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/get-started" element={<Landing />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/worker/:id" element={<WorkerDetail />} />
          <Route path="/register" element={<RegisterWorker />} />
          <Route path="/worker-login" element={<WorkerLogin />} />
          <Route path="/worker-forgot-password" element={<WorkerForgotPassword />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<UserForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes */}
          <Route path="/user/*" element={
            <UserRoute>
              <UserLayout>
                <Routes>
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="bookings" element={<UserBookings />} />
                  <Route path="settings" element={<UserSettings />} />
                  <Route path="find-workers" element={<Workers />} />
                </Routes>
              </UserLayout>
            </UserRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="workers" element={<AdminWorkers />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="reviews" element={<AdminPlaceholder title="Reviews" />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  <Route path="offers" element={<AdminPlaceholder title="Offers & Coupons" />} />
                <Route path="notifications" element={<AdminPlaceholder title="Notifications" />} />
                <Route path="settings" element={<AdminPlaceholder title="Admin Settings" />} />
                {/* Fallback for undefined admin routes */}
                <Route path="*" element={<AdminDashboard />} />
              </Routes>
            </AdminLayout>
          </AdminRoute>
        } />
      </Routes>
      </Layout>
    </Router>
  )
}

export default App
