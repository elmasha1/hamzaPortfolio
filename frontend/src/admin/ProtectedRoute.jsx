import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — gates admin pages. While the token is being validated it
 * shows a spinner; if unauthenticated it redirects to the login page.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-soft">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!isAuthed) {
    // Not signed in → bounce back to the login page (/admin).
    return <Navigate to="/admin" replace state={{ from: location }} />
  }

  return children
}
