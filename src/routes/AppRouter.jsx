import { lazy, Suspense, useEffect } from 'react'
import { AdminRoute } from '../components/AdminRoute'
import { Loading } from '../components/Loading'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from '../hooks/useRouter'
import { MainLayout } from '../layouts/MainLayout'
import { AccountPage } from '../pages/AccountPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ReservationDetailPage } from '../pages/ReservationDetailPage'
import { VehicleDetailPage } from '../pages/VehicleDetailPage'
import { VehiclesPage } from '../pages/VehiclesPage'
import { decodePathSegment } from '../utils/routes'

const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })))
const AdminReservationDetailPage = lazy(() => import('../pages/AdminReservationDetailPage').then((module) => ({ default: module.AdminReservationDetailPage })))
const AdminReservationsPage = lazy(() => import('../pages/AdminReservationsPage').then((module) => ({ default: module.AdminReservationsPage })))
const AdminUserDetailPage = lazy(() => import('../pages/AdminUserDetailPage').then((module) => ({ default: module.AdminUserDetailPage })))
const AdminUsersPage = lazy(() => import('../pages/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })))
const AdminVehicleCreatePage = lazy(() => import('../pages/AdminVehicleCreatePage').then((module) => ({ default: module.AdminVehicleCreatePage })))
const AdminVehicleDetailPage = lazy(() => import('../pages/AdminVehicleDetailPage').then((module) => ({ default: module.AdminVehicleDetailPage })))
const AdminVehiclesPage = lazy(() => import('../pages/AdminVehiclesPage').then((module) => ({ default: module.AdminVehiclesPage })))

export function AppRouter() {
  const { pathname, navigate, search } = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const detailMatch = pathname.match(/^\/vehiculos\/([^/]+)$/)
  const reservationMatch = pathname.match(/^\/reservaciones\/([^/]+)$/)
  const adminVehicleMatch = pathname.match(/^\/admin\/vehiculos\/([^/]+)$/)
  const adminReservationMatch = pathname.match(/^\/admin\/reservaciones\/([^/]+)$/)
  const adminUserMatch = pathname.match(/^\/admin\/usuarios\/([^/]+)$/)
  const detailId = detailMatch ? decodePathSegment(detailMatch[1]) : null
  const reservationId = reservationMatch ? decodePathSegment(reservationMatch[1]) : null
  const adminVehicleId = adminVehicleMatch ? decodePathSegment(adminVehicleMatch[1]) : null
  const adminReservationId = adminReservationMatch ? decodePathSegment(adminReservationMatch[1]) : null
  const adminUserId = adminUserMatch ? decodePathSegment(adminUserMatch[1]) : null
  const requiresAuthentication = pathname === '/cuenta' || pathname.startsWith('/reservaciones/') || pathname.startsWith('/admin')
  let page

  useEffect(() => {
    if (!isLoading && !isAuthenticated && requiresAuthentication) {
      navigate('/login', { replace: true, state: { returnTo: pathname } })
    }
  }, [isAuthenticated, isLoading, navigate, pathname, requiresAuthentication])

  if (pathname === '/') {
    page = <HomePage navigate={navigate} />
  } else if (pathname === '/vehiculos') {
    page = <VehiclesPage navigate={navigate} search={search} />
  } else if (pathname === '/login') {
    page = <LoginPage navigate={navigate} />
  } else if (pathname === '/registro') {
    page = <RegisterPage navigate={navigate} />
  } else if (pathname === '/cuenta') {
    page = (
      <ProtectedRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
      >
        <AccountPage navigate={navigate} />
      </ProtectedRoute>
    )
  } else if (reservationId !== null) {
    page = (
      <ProtectedRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
      >
        <ReservationDetailPage id={reservationId} navigate={navigate} />
      </ProtectedRoute>
    )
  } else if (adminUserId !== null) {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminUserDetailPage id={adminUserId} navigate={navigate} />
      </AdminRoute>
    )
  } else if (pathname === '/admin/usuarios') {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminUsersPage navigate={navigate} />
      </AdminRoute>
    )
  } else if (adminReservationId !== null) {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminReservationDetailPage id={adminReservationId} navigate={navigate} />
      </AdminRoute>
    )
  } else if (pathname === '/admin/reservaciones') {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminReservationsPage navigate={navigate} />
      </AdminRoute>
    )
  } else if (pathname === '/admin/vehiculos/nuevo') {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminVehicleCreatePage navigate={navigate} />
      </AdminRoute>
    )
  } else if (adminVehicleId !== null) {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminVehicleDetailPage id={adminVehicleId} navigate={navigate} />
      </AdminRoute>
    )
  } else if (pathname === '/admin/vehiculos') {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminVehiclesPage navigate={navigate} />
      </AdminRoute>
    )
  } else if (pathname === '/admin') {
    page = (
      <AdminRoute
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        navigate={navigate}
        role={user?.role}
      >
        <AdminDashboardPage navigate={navigate} />
      </AdminRoute>
    )
  } else if (detailId !== null) {
    page = (
      <VehicleDetailPage
        id={detailId}
        navigate={navigate}
      />
    )
  } else {
    page = <NotFoundPage navigate={navigate} />
  }

  return (
    <MainLayout navigate={navigate} pathname={pathname}>
      <Suspense fallback={<Loading message='Cargando página…' />}>
        {page}
      </Suspense>
    </MainLayout>
  )
}
