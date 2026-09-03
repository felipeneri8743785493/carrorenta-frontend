import { useEffect, useRef, useState } from 'react'
import { AuthMessage } from './AuthMessage'
import { CANCELLABLE_RESERVATION_STATUSES } from '../utils/reservationStatuses'

const cancellableStatuses = new Set(CANCELLABLE_RESERVATION_STATUSES)

export function ReservationCancellation({ disabled = false, onCancel, reservationId, status }) {
  const cancelChoiceRef = useRef(null)
  const cancelTriggerRef = useRef(null)
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)
  const canCancel = Boolean(reservationId) && cancellableStatuses.has(status)

  useEffect(() => {
    if (confirming) cancelChoiceRef.current?.focus()
  }, [confirming])

  function closeConfirmation() {
    setConfirming(false)
    requestAnimationFrame(() => cancelTriggerRef.current?.focus())
  }

  async function cancel() {
    setCancelling(true)
    setError(null)
    setSaved(false)
    try {
      await onCancel(reservationId)
      setConfirming(false)
      setCancelling(false)
      setSaved(true)
    } catch (requestError) {
      setError(requestError)
      setCancelling(false)
      setConfirming(false)
    }
  }

  if (!canCancel && !error && !saved) return null

  return (
    <div className='reservation-cancellation'>
      <AuthMessage error={error} />
      {saved && <p className='success-message' role='status'>Reservación cancelada correctamente.</p>}
      {canCancel && !confirming && !saved && (
        <button ref={cancelTriggerRef} className='danger-link' type='button' disabled={disabled} onClick={() => setConfirming(true)}>Cancelar reservación</button>
      )}
      {canCancel && confirming && (
        <div className='cancel-confirmation' role='group' aria-label='Confirmar cancelación' aria-busy={cancelling || disabled}>
          <span>¿Confirmas la cancelación?</span>
          <button ref={cancelChoiceRef} type='button' disabled={cancelling || disabled} onClick={closeConfirmation}>No</button>
          <button type='button' disabled={cancelling || disabled} onClick={cancel}>
            {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
          </button>
        </div>
      )}
    </div>
  )
}
