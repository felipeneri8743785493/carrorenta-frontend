import { useState } from 'react'
import { AuthMessage } from '../components/AuthMessage'
import { ErrorMessage } from '../components/ErrorMessage'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { useAuth } from '../hooks/useAuth'
import { useAdminReservation } from '../hooks/useAdminReservation'
import { updateAdminReservationStatus } from '../services/adminReservationService'
import { formatCurrency, formatDate } from '../utils/formatters'
import { getEntityId, getRelatedEntityId } from '../utils/identifiers'
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUSES } from '../utils/reservationStatuses'

export function AdminReservationDetailPage({ id, navigate }) {
  const { token } = useAuth()
  const { applyUpdate, error, isLoading, reload, reservation } = useAdminReservation(id, token)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [result, setResult] = useState({ error: null, saved: false, saving: false })

  async function submit(event) {
    event.preventDefault()
    setResult({ error: null, saved: false, saving: true })
    try {
      const updatedReservation = await updateAdminReservationStatus(id, selectedStatusValue, token)
      applyUpdate(updatedReservation && typeof updatedReservation === 'object'
        ? updatedReservation
        : { status: selectedStatusValue })
      setSelectedStatus(null)
      setResult({ error: null, saved: true, saving: false })
    } catch (requestError) {
      setResult({ error: requestError, saved: false, saving: false })
    }
  }

  if (isLoading && !reservation) return <div className='container detail-state'><Loading message='Cargando reservación...' /></div>
  if (error) return <div className='container detail-state'><ErrorMessage error={error} message='No fue posible consultar la información de esta reservación.' onRetry={reload} title='No pudimos cargar la reservación' /></div>
  if (!reservation) return <div className='container detail-state'><ErrorMessage message='El servidor respondió sin los datos solicitados.' onRetry={reload} title='No recibimos la reservación' /></div>

  const reservationId = getEntityId(reservation) ?? id
  const userId = getRelatedEntityId(reservation, 'user')
  const vehicleId = getRelatedEntityId(reservation, 'vehicle')
  const selectedStatusValue = selectedStatus ?? reservation.status

  return (
    <section className='account-page' aria-busy={isLoading}><div className='container'>
      <Link className='detail-back' navigate={navigate} to='/admin/reservaciones'>Volver a reservaciones</Link>
      <div className='account-card'>
        <p className='eyebrow'>Administración</p>
        <h1>Reservación #{reservationId}</h1>
        <dl className='reservation-card__details'>
          <div><dt>Usuario</dt><dd>#{userId ?? 'No disponible'}</dd></div>
          <div><dt>Vehículo</dt><dd>#{vehicleId ?? 'No disponible'}</dd></div>
          <div><dt>Recogida</dt><dd>{formatDate(reservation.startDate)}</dd></div>
          <div><dt>Devolución</dt><dd>{formatDate(reservation.endDate)}</dd></div>
          <div><dt>Precio diario</dt><dd>{formatCurrency(reservation.pricePerDay)}</dd></div>
          <div><dt>Total</dt><dd>{formatCurrency(reservation.totalPrice)}</dd></div>
        </dl>
        <div className='reservation-card__links'>
          {userId && <Link className='text-link' navigate={navigate} to={`/admin/usuarios/${encodeURIComponent(userId)}`}>Ver usuario</Link>}
          {vehicleId && <Link className='text-link' navigate={navigate} to={`/admin/vehiculos/${encodeURIComponent(vehicleId)}`}>Ver vehículo</Link>}
        </div>
        <form className='auth-form' aria-busy={result.saving || isLoading} onSubmit={submit}>
          <label className='form-field'>Estado
            <select value={selectedStatusValue} disabled={result.saving || isLoading} onChange={(event) => { setSelectedStatus(event.target.value); setResult({ error: null, saved: false, saving: false }) }}>
              {RESERVATION_STATUSES.map((status) => <option key={status} value={status}>{RESERVATION_STATUS_LABELS[status]}</option>)}
            </select>
          </label>
          <p>El backend validará si el cambio de estado es permitido.</p>
          <AuthMessage error={result.error} />
          {result.saved && <p className='success-message' role='status'>Estado actualizado correctamente.</p>}
          <button className='button button--primary' disabled={result.saving || isLoading || selectedStatusValue === reservation.status} type='submit'>
            {result.saving || isLoading ? 'Actualizando...' : 'Actualizar estado'}
          </button>
        </form>
      </div>
    </div></section>
  )
}
