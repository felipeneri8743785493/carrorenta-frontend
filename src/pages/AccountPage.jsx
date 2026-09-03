import { useState } from 'react'
import { AccountProfile } from '../components/AccountProfile'
import { PasswordForm } from '../components/PasswordForm'
import { ReservationList } from '../components/ReservationList'
import { useAuth } from '../hooks/useAuth'
import { USER_ROLE_LABELS } from '../utils/userRoles'

export function AccountPage({ navigate }) {
  const { logout, user } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
    } finally {
      navigate('/')
    }
  }

  return (
    <section className="account-page">
      <div className="container">
        <div className="account-card">
          <p className="eyebrow">Mi cuenta</p>
          <h1>Hola, {user?.name ?? user?.email ?? 'Usuario'}</h1>
          <p>Consulta tu información y administra tus reservaciones.</p>
          <dl className="account-details">
            <div><dt>Correo</dt><dd>{user?.email ?? 'No disponible'}</dd></div>
            <div><dt>Rol</dt><dd>{USER_ROLE_LABELS[user?.role] ?? user?.role ?? 'No disponible'}</dd></div>
          </dl>
          <button className="button button--ghost" type="button" disabled={loggingOut} onClick={handleLogout}>
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
        <div className="account-settings">
          <AccountProfile />
          <PasswordForm />
        </div>
        <ReservationList navigate={navigate} />
      </div>
    </section>
  )
}
