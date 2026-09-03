import { ErrorMessage } from '../components/ErrorMessage'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { ReservationCancellation } from '../components/ReservationCancellation'
import { useAuth } from '../hooks/useAuth'
import { useReservation } from '../hooks/useReservation'
import { cancelReservation } from '../services/reservationService'
import { formatCurrency, formatDate } from '../utils/formatters'
import { getEntityId, getRelatedEntityId } from '../utils/identifiers'
import { RESERVATION_STATUS_LABELS } from '../utils/reservationStatuses'

export function ReservationDetailPage({ id, navigate }) {
  const { token } = useAuth()
  const { error, isLoading, reload, reservation } = useReservation(id, token)

  if (isLoading && !reservation) {
    return <div className='container detail-state'><Loading message='Cargando reservación...' /></div>
  }

  if (error) {
    return <div className='container detail-state'><ErrorMessage error={error} message='No fue posible consultar esta reservación.' onRetry={reload} title='No pudimos cargar la reservación' /></div>
  }

  if (!reservation) {
    return <div className='container detail-state'><ErrorMessage message='El servidor respondió sin los datos solicitados.' onRetry={reload} title='No recibimos la reservación' /></div>
  }

  const reservationId = getEntityId(reservation) ?? id
  const vehicleId = getRelatedEntityId(reservation, 'vehicle')
  const status = typeof reservation.status === 'string' ? reservation.status : 'UNKNOWN'

  async function cancel(idToCancel) {
    await cancelReservation(idToCancel, token)
    reload()
  }

  return (
    <section className='account-page' aria-busy={isLoading}>
      <div className='container'>
        <Link className='detail-back' navigate={navigate} to='/cuenta'>Volver a mi cuenta</Link>
        <div className='account-card'>
          <p className='eyebrow'>Mi cuenta</p>
          <h1>Reservación #{reservationId}</h1>
          <p>
            Estado: <span className={`reservation-status reservation-status--${status.toLowerCase()}`}>{RESERVATION_STATUS_LABELS[status] ?? status}</span>
          </p>
          <dl className='reservation-card__details'>
            <div><dt>Vehículo</dt><dd>#{vehicleId ?? 'No disponible'}</dd></div>
            <div><dt>Recogida</dt><dd>{formatDate(reservation.startDate)}</dd></div>
            <div><dt>Devolución</dt><dd>{formatDate(reservation.endDate)}</dd></div>
            <div><dt>Precio diario</dt><dd>{formatCurrency(reservation.pricePerDay)}</dd></div>
            <div><dt>Total</dt><dd>{formatCurrency(reservation.totalPrice)}</dd></div>
          </dl>
          <div className='reservation-detail__actions'>
            {vehicleId && <Link className='text-link' navigate={navigate} to={`/vehiculos/${encodeURIComponent(vehicleId)}`}>Ver vehículo</Link>}
            <ReservationCancellation disabled={isLoading} onCancel={cancel} reservationId={reservationId} status={status} />
          </div>
        </div>
      </div>
    </section>
  )
}
