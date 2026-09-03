import { apiRequest } from '../api/client'
import { unwrapData, unwrapList } from '../api/response'
import { normalizePagination } from '../utils/pagination'

const headers = (token) => ({ Authorization: `Bearer ${token}` })

export async function checkAvailability(vehicleId, dates, signal) {
  const query = new URLSearchParams(dates)
  return unwrapData(await apiRequest(
    `/api/vehicles/${encodeURIComponent(vehicleId)}/availability?${query}`,
    { signal },
  ))
}

export async function createReservation(vehicleId, dates, token) {
  return unwrapData(await apiRequest('/api/reservations', {
    method: 'POST',
    headers: headers(token),
    body: { vehicleId: Number(vehicleId), ...dates },
  }))
}

export async function getReservations({ page, status }, token, signal) {
  const query = new URLSearchParams({ page: String(page), limit: '10' })
  if (status) query.set('status', status)
  const response = await apiRequest(`/api/reservations?${query}`, {
    headers: headers(token),
    signal,
  })
  return {
    reservations: unwrapList(response),
    pagination: normalizePagination(response?.meta, page),
  }
}

export async function getReservation(id, token, signal) {
  return unwrapData(await apiRequest(
    `/api/reservations/${encodeURIComponent(id)}`,
    { headers: headers(token), signal },
  ))
}

export async function cancelReservation(id, token) {
  return unwrapData(await apiRequest(
    `/api/reservations/${encodeURIComponent(id)}/cancel`,
    { method: 'PATCH', headers: headers(token) },
  ))
}
