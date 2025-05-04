import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PublicRoute() {
  const { isAuthenticated } = useSelector((state) => state.user)
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <Outlet />
}

export default PublicRoute