import { useState } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { EmptyState } from '../components/EmptyState'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../hooks/useAuth'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { formatDate } from '../utils/formatters'
import { getEntityId } from '../utils/identifiers'
import { USER_ROLE_LABELS } from '../utils/userRoles'

export function AdminUsersPage({ navigate }) {
  const { token } = useAuth()
  const [page, setPage] = useState(1)
  const [role, setRole] = useState('')
  const { error, isLoading, pagination, reload, users } = useAdminUsers(page, role, token, setPage)

  function updateRole(event) {
    setRole(event.target.value)
    setPage(1)
  }

  return (
    <section className='catalog-page'><div className='container'>
      <header className='catalog-header'>
        <p className='eyebrow'>Administración</p>
        <h1>Usuarios</h1>
        <p>Consulta las cuentas registradas y administra sus roles.</p>
      </header>
      <div className='catalog-summary admin-list-actions'>
        <label htmlFor='admin-user-role'>Rol
          <select id='admin-user-role' value={role} onChange={updateRole}>
            <option value=''>Todos</option>
            {Object.entries(USER_ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button className='button button--ghost' type='button' disabled={!role} onClick={() => { setRole(''); setPage(1) }}>Limpiar filtro</button>
      </div>
      {isLoading && <Loading message='Cargando usuarios...' />}
      {!isLoading && error && <ErrorMessage error={error} message='No fue posible consultar las cuentas registradas.' onRetry={reload} title='No pudimos cargar los usuarios' />}
      {!isLoading && !error && users.length === 0 && (
        <EmptyState
          actionLabel='Ver todos los roles'
          message={role ? 'Prueba consultando todos los roles.' : 'Las cuentas aparecerán aquí cuando se registren.'}
          onAction={role ? () => { setRole(''); setPage(1) } : undefined}
          title={role ? `No hay usuarios con rol ${USER_ROLE_LABELS[role]}` : 'No hay usuarios registrados'}
        />
      )}
      {!isLoading && !error && users.length > 0 && (
        <>
          <p className='catalog-summary' aria-live='polite'>{pagination.totalItems} usuarios encontrados</p>
          <div className='vehicle-grid'>
            {users.map((user, index) => {
              const id = getEntityId(user)
              return <article className='account-card' key={id ?? `user-${index}`}>
                <p className='eyebrow'>{USER_ROLE_LABELS[user.role] ?? user.role ?? 'Rol no disponible'}</p>
                <h2>{user.name ?? 'Usuario'}</h2>
                <p>{user.email}</p>
                {user.createdAt && <p>Registro: {formatDate(user.createdAt)}</p>}
                {id ? <Link className='button button--ghost' navigate={navigate} to={`/admin/usuarios/${encodeURIComponent(id)}`}>Administrar</Link> : <span>Administración no disponible</span>}
              </article>
            })}
          </div>
          <Pagination currentPage={pagination.currentPage} onPageChange={setPage} totalPages={pagination.totalPages} />
        </>
      )}
    </div></section>
  )
}
