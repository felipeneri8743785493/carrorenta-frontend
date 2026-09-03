import { useMemo, useState } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { EmptyState } from '../components/EmptyState'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../hooks/useAuth'
import { useAdminReservations } from '../hooks/useAdminReservations'
import { formatCurrency, formatDate } from '../utils/formatters'
import { getEntityId, getRelatedEntityId } from '../utils/identifiers'
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUSES } from '../utils/reservationStatuses'
const emptyFilters = { status: '', userId: '', vehicleId: '' }

export function AdminReservationsPage({ navigate }) {
  const { token } = useAuth()
  const [page, setPage] = useState(1)
  const [draftFilters, setDraftFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const filters = useMemo(() => ({ ...appliedFilters, page }), [appliedFilters, page])
  const { error, isLoading, pagination, reload, reservations } = useAdminReservations(filters, token, setPage)

  function change(event) {
    setDraftFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function applyFilters(event) {
    event.preventDefault()
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  function clearFilters() {
    setDraftFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setPage(1)
  }

  return (
    <section className='catalog-page'><div className='container'>
      <header className='catalog-header'>
        <p className='eyebrow'>Administración</p>
        <h1>Reservaciones</h1>
        <p>Consulta la operación completa y filtra por estado, usuario o vehículo.</p>
      </header>
      <form className='admin-filters auth-form auth-form--grid' onSubmit={applyFilters}>
        <label className='form-field' htmlFor='admin-reservation-status'>Estado<select id='admin-reservation-status' name='status' value={draftFilters.status} onChange={change}>
          <option value=''>Todos</option>
          {RESERVATION_STATUSES.map((status) => <option key={status} value={status}>{RESERVATION_STATUS_LABELS[status]}</option>)}
        </select></label>
        <label className='form-field' htmlFor='admin-reservation-user'>ID de usuario<input id='admin-reservation-user' min='1' name='userId' type='number' value={draftFilters.userId} onChange={change} /></label>
        <label className='form-field' htmlFor='admin-reservation-vehicle'>ID de vehículo<input id='admin-reservation-vehicle' min='1' name='vehicleId' type='number' value={draftFilters.vehicleId} onChange={change} /></label>
        <button className='button button--primary' type='submit'>Aplicar filtros</button>
        <button className='button button--ghost' type='button' disabled={!Object.values(draftFilters).some(Boolean) && !Object.values(appliedFilters).some(Boolean)} onClick={clearFilters}>Limpiar filtros</button>
      </form>
      {isLoading && <Loading message='Cargando reservaciones...' />}
      {!isLoading && error && <ErrorMessage error={error} message='No fue posible consultar la operación de reservaciones.' onRetry={reload} title='No pudimos cargar las reservaciones' />}
      {!isLoading && !error && reservations.length === 0 && (
        <EmptyState
          actionLabel='Limpiar filtros'
          message={Object.values(appliedFilters).some(Boolean) ? 'Prueba con otros filtros.' : 'Las reservaciones aparecerán aquí cuando se creen.'}
          onAction={Object.values(appliedFilters).some(Boolean) ? clearFilters : undefined}
          title='No hay reservaciones'
        />
      )}
      {!isLoading && !error && reservations.length > 0 && (
        <>
          <p className='catalog-summary' aria-live='polite'>{pagination.totalItems} reservaciones encontradas</p>
          <div className='reservation-list'>
            {reservations.map((reservation, index) => {
              const id = getEntityId(reservation)
              const userId = getRelatedEntityId(reservation, 'user')
              const vehicleId = getRelatedEntityId(reservation, 'vehicle')
              return <article className='reservation-card' key={id ?? `reservation-${index}`}>
                <header><div><p>Reservación #{id ?? 'No disponible'}</p><h3>Vehículo #{vehicleId ?? 'No disponible'}</h3></div>
                  <span className={`reservation-status reservation-status--${(reservation.status ?? 'unknown').toLowerCase()}`}>{RESERVATION_STATUS_LABELS[reservation.status] ?? reservation.status ?? 'No disponible'}</span>
                </header>
                <dl className='reservation-card__details'>
                  <div><dt>Usuario</dt><dd>#{userId ?? 'No disponible'}</dd></div>
                  <div><dt>Recogida</dt><dd>{formatDate(reservation.startDate)}</dd></div>
                  <div><dt>Devolución</dt><dd>{formatDate(reservation.endDate)}</dd></div>
                  <div><dt>Total</dt><dd>{formatCurrency(reservation.totalPrice)}</dd></div>
                </dl>
                <footer><div className='reservation-card__links'>
                  {id && <Link className='text-link' navigate={navigate} to={`/admin/reservaciones/${encodeURIComponent(id)}`}>Administrar reservación</Link>}
                  {userId && <Link className='text-link' navigate={navigate} to={`/admin/usuarios/${encodeURIComponent(userId)}`}>Ver usuario</Link>}
                  {vehicleId && <Link className='text-link' navigate={navigate} to={`/admin/vehiculos/${encodeURIComponent(vehicleId)}`}>Ver vehículo</Link>}
                </div></footer>
              </article>
            })}
          </div>
          <Pagination currentPage={pagination.currentPage} onPageChange={setPage} totalPages={pagination.totalPages} />
        </>
      )}
    </div></section>
  )
}
