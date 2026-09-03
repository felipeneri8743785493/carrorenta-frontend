export const RESERVATION_STATUS_LABELS = Object.freeze({
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
})

export const RESERVATION_STATUS_LABELS_PLURAL = Object.freeze(
  Object.fromEntries(Object.entries(RESERVATION_STATUS_LABELS).map(
    ([status, label]) => [status, `${label}s`],
  )),
)

export const RESERVATION_STATUSES = Object.freeze(Object.keys(RESERVATION_STATUS_LABELS))
export const CANCELLABLE_RESERVATION_STATUSES = Object.freeze(['PENDING', 'CONFIRMED'])
