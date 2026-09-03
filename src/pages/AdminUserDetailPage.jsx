import { useState } from 'react'
import { AuthMessage } from '../components/AuthMessage'
import { ErrorMessage } from '../components/ErrorMessage'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { useAuth } from '../hooks/useAuth'
import { useAdminUser } from '../hooks/useAdminUser'
import { updateAdminUserRole } from '../services/adminUserService'
import { formatDate } from '../utils/formatters'
import { getEntityId } from '../utils/identifiers'
import { USER_ROLE, USER_ROLES, USER_ROLE_LABELS } from '../utils/userRoles'

export function AdminUserDetailPage({ id, navigate }) {
  const { token, user: currentUser } = useAuth()
  const { applyUpdate, error, isLoading, reload, user } = useAdminUser(id, token)
  const [selectedRole, setSelectedRole] = useState(null)
  const [result, setResult] = useState({ error: null, saved: false, saving: false })

  async function submit(event) {
    event.preventDefault()
    if (removesOwnAdminRole) return

    setResult({ error: null, saved: false, saving: true })
    try {
      const updatedUser = await updateAdminUserRole(id, selectedRoleValue, token)
      applyUpdate(updatedUser && typeof updatedUser === 'object'
        ? updatedUser
        : { role: selectedRoleValue })
      setSelectedRole(null)
      setResult({ error: null, saved: true, saving: false })
    } catch (requestError) {
      setResult({ error: requestError, saved: false, saving: false })
    }
  }

  if (isLoading && !user) return <div className='container detail-state'><Loading message='Cargando usuario...' /></div>
  if (error) return <div className='container detail-state'><ErrorMessage error={error} message='No fue posible consultar la información de esta cuenta.' onRetry={reload} title='No pudimos cargar el usuario' /></div>
  if (!user) return <div className='container detail-state'><ErrorMessage message='El servidor respondió sin los datos solicitados.' onRetry={reload} title='No recibimos el usuario' /></div>

  const selectedRoleValue = selectedRole ?? user.role
  const isCurrentUser = String(getEntityId(currentUser)) === String(getEntityId(user))
  const removesOwnAdminRole = isCurrentUser
    && user.role === USER_ROLE.ADMIN
    && selectedRoleValue !== USER_ROLE.ADMIN

  return (
    <section className='account-page' aria-busy={isLoading}><div className='container'>
      <Link className='detail-back' navigate={navigate} to='/admin/usuarios'>Volver a usuarios</Link>
      <div className='account-card'>
        <p className='eyebrow'>Administración</p>
        <h1>{user.name ?? 'Usuario'}</h1>
        <dl className='account-details'>
          <div><dt>ID</dt><dd>#{user.id ?? user._id}</dd></div>
          <div><dt>Correo</dt><dd>{user.email}</dd></div>
          <div><dt>Rol actual</dt><dd>{USER_ROLE_LABELS[user.role] ?? user.role}</dd></div>
          {user.createdAt && <div><dt>Registro</dt><dd>{formatDate(user.createdAt)}</dd></div>}
        </dl>
        <form className='auth-form' aria-busy={result.saving || isLoading} onSubmit={submit}>
          <label className='form-field'>Rol
            <select value={selectedRoleValue} disabled={result.saving || isLoading} onChange={(event) => { setSelectedRole(event.target.value); setResult({ error: null, saved: false, saving: false }) }}>
              {USER_ROLES.map((role) => <option key={role} value={role}>{USER_ROLE_LABELS[role]}</option>)}
            </select>
          </label>
          {removesOwnAdminRole && <p className='field-error' role='status'>No puedes retirar tu propio rol de administrador.</p>}
          <AuthMessage error={result.error} />
          {result.saved && <p className='success-message' role='status'>Rol actualizado correctamente.</p>}
          <button className='button button--primary' disabled={result.saving || isLoading || removesOwnAdminRole || selectedRoleValue === user.role} type='submit'>
            {result.saving || isLoading ? 'Actualizando...' : 'Actualizar rol'}
          </button>
        </form>
      </div>
    </div></section>
  )
}
