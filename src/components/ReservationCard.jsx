import { formatCurrency, formatDate } from '../utils/formatters'
import { getEntityId, getRelatedEntityId } from '../utils/identifiers'
import { RESERVATION_STATUS_LABELS } from '../utils/reservationStatuses'
import { Link } from './Link'
import { ReservationCancellation } from './ReservationCancellation'

export function ReservationCard({ navigate, onCancel, reservation }) {
  const reservationId = getEntityId(reservation)
  const vehicleId = getRelatedEntityId(reservation, 'vehicle')
  const status = typeof reservation.status === 'string' ? reservation.status : 'UNKNOWN'

  return (
    <article className="reservation-card">
      <header>
        <div><p>Reservación #{reservationId ?? 'No disponible'}</p><h3>Vehículo #{vehicleId ?? 'No disponible'}</h3></div>
        <span className={`reservation-status reservation-status--${status.toLowerCase()}`}>
          {RESERVATION_STATUS_LABELS[status] ?? status}
        </span>
      </header>
      <dl className="reservation-card__details">
        <div><dt>Recogida</dt><dd>{formatDate(reservation.startDate)}</dd></div>
        <div><dt>Devolución</dt><dd>{formatDate(reservation.endDate)}</dd></div>
        <div><dt>Precio diario</dt><dd>{formatCurrency(reservation.pricePerDay)}</dd></div>
        <div><dt>Total</dt><dd>{formatCurrency(reservation.totalPrice)}</dd></div>
      </dl>
      <footer>
        <div className='reservation-card__links'>
          {reservationId && <Link className='text-link' navigate={navigate} to={`/reservaciones/${encodeURIComponent(reservationId)}`}>Ver reservación</Link>}
          {vehicleId && <Link className='text-link' navigate={navigate} to={`/vehiculos/${encodeURIComponent(vehicleId)}`}>Ver vehículo</Link>}
        </div>
        <ReservationCancellation onCancel={onCancel} reservationId={reservationId} status={status} />
      </footer>
    </article>
  )
}
