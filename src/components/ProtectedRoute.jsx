import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import Loader from './Loader'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated, loading } = useAuth()

  // Wait for auth to resolve before making any decisions
  if (loading) {
    return <Loader fullScreen label="Authenticating..." size="lg" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Normalize role comparison to be case-insensitive
  const userRole = (user?.role || '').toLowerCase()
  const required = (requiredRole || '').toLowerCase()

  // DEBUG - visible in browser console
  console.log('[ProtectedRoute] userRole:', userRole, '| requiredRole:', required)

  if (required && userRole !== required) {
    if (required === 'recruiter' && userRole === 'candidate') {
      toast.error('Candidates cannot post jobs.')
    } else if (required === 'candidate' && userRole === 'recruiter') {
      toast.error('Recruiters cannot apply for jobs.')
    }

    // Determine redirect path based on normalized user role
    let redirectPath = '/jobs'
    if (userRole === 'admin') {
      redirectPath = '/admin-dashboard'
    } else if (userRole === 'recruiter') {
      redirectPath = '/recruiter-dashboard'
    }

    return <Navigate to={redirectPath} replace />
  }

  return children
}
