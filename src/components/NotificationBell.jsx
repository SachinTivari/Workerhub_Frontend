import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Bell } from 'lucide-react'
import './NotificationBell.css'

function NotificationBell({ userId, isWorker }) {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const fetchNotifications = async () => {
    if (!userId) return
    try {
      const param = isWorker ? `worker_id=${userId}` : `user_id=${userId}`
      const res = await axios.get(`${API_URL}/api/notifications?${param}`)
      setNotifications(res.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Fetch immediately and poll every 30 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [userId, isWorker])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = async () => {
    try {
      const payload = isWorker ? { worker_id: userId } : { user_id: userId }
      await axios.put(`${API_URL}/api/notifications/mark-read`, payload)
      // Optimistically update UI
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button 
        className="bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="mark-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <h5>{notification.title}</h5>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
