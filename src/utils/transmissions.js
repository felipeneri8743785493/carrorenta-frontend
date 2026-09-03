export const TRANSMISSION_LABELS = Object.freeze({
  AUTOMATIC: 'Automática',
  MANUAL: 'Manual',
})

export const TRANSMISSIONS = Object.freeze(Object.keys(TRANSMISSION_LABELS))

export function formatTransmission(value, fallback = 'No especificada') {
  if (typeof value !== 'string' || !value.trim()) return fallback
  return TRANSMISSION_LABELS[value.trim().toUpperCase()] ?? value
}
