import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { checkAvailability, createReservation } from '../services/reservationService'
import { addDateInputDays, formatCurrency, formatDateInput, normalizeFutureDateRange } from '../utils/formatters'
import { RESERVATION_STATUS_LABELS } from '../utils/reservationStatuses'
import { AuthMessage } from './AuthMessage'
import { Link } from './Link'

export function AvailabilityPanel({ initialDates, navigate, price, vehicleId }) {
  const { isAuthenticated, token } = useAuth()
  const [dates, setDates] = useState(() => normalizeFutureDateRange(initialDates))
  const [available, setAvailable] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState('')
  const minimumDate = formatDateInput()
  const minimumEndDate = addDateInputDays(dates.startDate || minimumDate, 1)

  function changeDate(event) {
    const { name, value } = event.target
    setDates((current) => ({
      ...current,
      [name]: value,
      ...(name === 'startDate' && current.endDate <= value && { endDate: '' }),
    }))
    setAvailable(null)
    setReservation(null)
    setError(null)
  }

  async function check(event) {
    event.preventDefault()
    setError(null)
    setPendingAction('check')
    try {
      const result = await checkAvailability(vehicleId, dates)
      setAvailable(result.available)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setPendingAction('')
    }
  }

  async function reserve() {
    setError(null)
    setPendingAction('reserve')
    try {
      setReservation(await createReservation(vehicleId, dates, token))
      setAvailable(null)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setPendingAction('')
    }
  }

  if (reservation) {
    return (
      <aside className="availability-panel reservation-success" aria-live="polite">
        <span className="reservation-success__icon" aria-hidden="true">✓</span>
        <h2>Reservación creada</h2>
        <p>El backend confirmó las fechas y calculó el total.</p>
        <dl>
          <div><dt>Estado</dt><dd>{RESERVATION_STATUS_LABELS[reservation.status] ?? reservation.status ?? 'No disponible'}</dd></div>
          <div><dt>Total</dt><dd>{formatCurrency(reservation.totalPrice)}</dd></div>
        </dl>
        <Link className="button button--primary" navigate={navigate} to="/cuenta">
          Ver mis reservaciones
        </Link>
      </aside>
    )
  }

  return (
    <aside className="availability-panel" aria-labelledby="availability-title" aria-busy={Boolean(pendingAction)}>
      <p className="availability-panel__price"><strong>{price}</strong> <span>/ día</span></p>
      <h2 id="availability-title">Consulta disponibilidad</h2>
      <p>El servidor validará el periodo y la disponibilidad.</p>
      <AuthMessage error={error} />
      <form className="availability-form" onSubmit={check}>
        <div className="form-field">
          <label htmlFor="startDate">Recogida</label>
          <input id="startDate" name="startDate" type="date" min={minimumDate} value={dates.startDate} disabled={Boolean(pendingAction)} required onChange={changeDate} />
        </div>
        <div className="form-field">
          <label htmlFor="endDate">Devolución</label>
          <input id="endDate" name="endDate" type="date" min={minimumEndDate} value={dates.endDate} disabled={Boolean(pendingAction)} required onChange={changeDate} />
        </div>
        <button className="button button--ghost" type="submit" disabled={Boolean(pendingAction)}>
          {pendingAction === 'check' ? 'Consultando...' : 'Comprobar disponibilidad'}
        </button>
      </form>
      {available === false && (
        <p className="availability-result availability-result--unavailable" role="status">
          No está disponible para esas fechas.
        </p>
      )}
      {available === true && (
        <div className="availability-result availability-result--available" role="status">
          <strong>Disponible para estas fechas</strong>
          <p>El backend calculará el total definitivo al reservar.</p>
          {isAuthenticated ? (
            <button className="button button--primary" type="button" disabled={Boolean(pendingAction)} onClick={reserve}>
              {pendingAction === 'reserve' ? 'Creando reservación...' : 'Confirmar reservación'}
            </button>
          ) : (
            <Link className="button button--primary" navigate={navigate} state={{ returnState: { reservationDates: dates }, returnTo: `/vehiculos/${encodeURIComponent(vehicleId)}` }} to="/login">
              Inicia sesión para reservar
            </Link>
          )}
        </div>
      )}
    </aside>
  )
}
