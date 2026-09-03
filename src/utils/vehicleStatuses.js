export const VEHICLE_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  MAINTENANCE: 'MAINTENANCE',
  INACTIVE: 'INACTIVE',
})

export const VEHICLE_STATUSES = Object.freeze(Object.values(VEHICLE_STATUS))

export const VEHICLE_STATUS_LABELS = Object.freeze({
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  MAINTENANCE: 'Mantenimiento',
  INACTIVE: 'Inactivo',
})

export const VEHICLE_STATUS_LABELS_PLURAL = Object.freeze({
  AVAILABLE: 'Disponibles',
  RESERVED: 'Reservados',
  MAINTENANCE: 'Mantenimiento',
  INACTIVE: 'Inactivos',
})
