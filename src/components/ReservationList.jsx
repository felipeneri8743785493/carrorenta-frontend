import { useAuth } from '../hooks/useAuth'
import { useReservations } from '../hooks/useReservations'
import { ErrorMessage } from './ErrorMessage'
import { EmptyState } from './EmptyState'
import { Loading } from './Loading'
import { Pagination } from './Pagination'
import { ReservationCard } from './ReservationCard'
import { getEntityId } from '../utils/identifiers'
import { RESERVATION_STATUS_LABELS_PLURAL, RESERVATION_STATUSES } from '../utils/reservationStatuses'

const statuses = [
  ['', 'Todas'],
  ...RESERVATION_STATUSES.map((status) => [status, RESERVATION_STATUS_LABELS_PLURAL[status]]),
]

export function ReservationList({ navigate }) {
  const { token } = useAuth()
  const data = useReservations(token)

  return (
    <section className="reservations-section" aria-labelledby="reservations-title">
      <div className="reservations-heading">
        <div><p className="eyebrow">Historial</p><h2 id="reservations-title">Mis reservaciones</h2></div>
        <div className="form-field reservation-filter">
          <label htmlFor="reservation-status">Estado</label>
          <select id="reservation-status" value={data.status} onChange={(event) => data.setStatus(event.target.value)}>
            {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
      {data.isLoading && <Loading message='Cargando tus reservaciones...' />}
      {!data.isLoading && data.error && (
        <ErrorMessage
          error={data.error}
          message="No fue posible consultar tu historial de reservaciones."
          onRetry={data.reload}
          title="No pudimos cargar tus reservaciones"
        />
      )}
      {!data.isLoading && !data.error && data.reservations.length === 0 && (
        <EmptyState
          actionLabel='Ver todas'
          headingLevel={3}
          message={data.status ? 'Prueba consultando todos los estados.' : 'Cuando reserves aparecerá aquí.'}
          onAction={data.status ? () => data.setStatus('') : undefined}
          title={data.status ? 'No hay reservaciones en esta categoría' : 'Aún no tienes reservaciones'}
        />
      )}
      {!data.isLoading && !data.error && data.reservations.length > 0 && (
        <>
          <div className="reservation-list">
            {data.reservations.map((reservation, index) => (
              <ReservationCard key={getEntityId(reservation) ?? `reservation-${index}`} navigate={navigate} reservation={reservation} onCancel={data.cancel} />
            ))}
          </div>
          <Pagination currentPage={data.pagination.currentPage} totalPages={data.pagination.totalPages} onPageChange={data.setPage} />
        </>
      )}
    </section>
  )
}
