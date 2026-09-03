const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
})
const date = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
})

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'Consultar'
  const amount = Number(value)
  return Number.isFinite(amount) ? currency.format(amount) : 'Consultar'
}

export function formatDate(value) {
  if (!value) return 'No disponible'
  const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? 'No disponible' : date.format(parsed)
}

export function formatDateInput(value = new Date()) {
  return value.toISOString().slice(0, 10)
}

export function addDateInputDays(value, days) {
  const dateValue = new Date(`${value}T00:00:00.000Z`)
  dateValue.setUTCDate(dateValue.getUTCDate() + days)
  return formatDateInput(dateValue)
}

export function isValidDateInput(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function normalizeFutureDateRange(value = {}) {
  const today = formatDateInput()
  const startDate = isValidDateInput(value.startDate) && value.startDate >= today
    ? value.startDate
    : ''
  const endDate = startDate && isValidDateInput(value.endDate) && value.endDate > startDate
    ? value.endDate
    : ''
  return { startDate, endDate }
}
