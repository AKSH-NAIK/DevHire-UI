import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'recruiter' && user.role === 'candidate') {
      toast.error('Candidates cannot post jobs.')
    } else if (requiredRole === 'candidate' && user.role === 'recruiter') {
      toast.error('Recruiters cannot apply for jobs.')
    }

    return <Navigate to={user.role === 'recruiter' ? '/recruiter-dashboard' : '/jobs'} replace />
  }

  return children
}
