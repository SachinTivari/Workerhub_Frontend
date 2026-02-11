import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import './Auth.css'

function WorkerForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Verify, 2: Reset Password
  const [workerId, setWorkerId] = useState(null)
  const [workerName, setWorkerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [verifyData, setVerifyData] = useState({
    phone: '',
    aadhaar_number: ''
  })

  const [resetData, setResetData] = useState({
    new_password: '',
    confirm_password: ''
  })

  const handleVerifyChange = (e) => {
    setVerifyData({
      ...verifyData,
      [e.target.name]: e.target.value
    })
  }

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    })
  }

  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API_URL}/api/workers/forgot-password/verify`, verifyData)
      setWorkerId(res.data.worker_id)
      setWorkerName(res.data.name)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (resetData.new_password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (resetData.new_password !== resetData.confirm_password) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await axios.post(`${API_URL}/api/workers/forgot-password/reset`, {
        worker_id: workerId,
        new_password: resetData.new_password
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page worker-auth">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">✅</div>
            <h1>Password Reset Successful!</h1>
            <p>Your password has been changed successfully</p>
          </div>
          <div className="auth-form">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/worker-login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page worker-auth">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔑</div>
          <h1>Forgot Password</h1>
          <p>
            {step === 1 
              ? 'Enter your phone number and Aadhaar to verify your identity' 
              : `Hi ${workerName}, set your new password`}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Verify</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Reset</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleVerifySubmit} className="auth-form">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={verifyData.phone}
                onChange={handleVerifyChange}
                placeholder="Enter your registered phone"
                required
              />
            </div>

            <div className="form-group">
              <label>Aadhaar Number</label>
              <input
                type="text"
                name="aadhaar_number"
                value={verifyData.aadhaar_number}
                onChange={handleVerifyChange}
                placeholder="Enter your 12-digit Aadhaar number"
                maxLength="12"
                required
              />
              <span className="input-hint">We'll verify this matches our records</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Identity'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="auth-form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="new_password"
                value={resetData.new_password}
                onChange={handleResetChange}
                placeholder="Enter new password"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={resetData.confirm_password}
                onChange={handleResetChange}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setStep(1)}
              style={{ marginTop: '10px' }}
            >
              ← Back
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Remember your password? <Link to="/worker-login">Login</Link></p>
          <p className="mt-2">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default WorkerForgotPassword

