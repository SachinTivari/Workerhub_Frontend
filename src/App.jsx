import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import './App.css'

// Layout component to conditionally show Navbar
function Layout({ children }) {
  const location = useLocation()
  const hiddenNavbarPaths = ['/', '/login', '/signup', '/register', '/worker-login', '/worker-forgot-password', '/worker-dashboard', '/forgot-password']
  const showNavbar = !hiddenNavbarPaths.includes(location.pathname)

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "main-content" : "main-content-full"}>
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
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
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
