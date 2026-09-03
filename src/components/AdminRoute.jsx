import { useEffect } from 'react'
import { Loading } from './Loading'
import { USER_ROLE } from '../utils/userRoles'

export function AdminRoute({ children, isAuthenticated, isLoading, navigate, role }) {
  const isAdmin = isAuthenticated && role === USER_ROLE.ADMIN

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate(isAuthenticated ? '/cuenta' : '/login')
  }, [isAdmin, isAuthenticated, isLoading, navigate])

  if (isLoading) return <div className='container detail-state'><Loading message='Verificando permisos...' /></div>
  return isAdmin ? children : null
}
