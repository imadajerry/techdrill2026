import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingState from '../components/feedback/LoadingState'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/auth'

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]
}

function getDefaultPath(role: UserRole | null) {
  if (role === 'customer') {
    return '/'
  }

  if (role === 'admin' || role === 'superadmin') {
    return '/admin/dashboard'
  }

  return '/login'
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, role } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <LoadingState />
  }

  if (!isAuthenticated || !role) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate replace to={getDefaultPath(role)} />
  }

  return <Outlet />
}
