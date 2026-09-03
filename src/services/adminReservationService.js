import { apiRequest } from '../api/client'
import { unwrapData, unwrapList } from '../api/response'
import { normalizePagination } from '../utils/pagination'

export async function getAdminReservations(filters, token, signal) {
  const query = new URLSearchParams({ page: String(filters.page), limit: '10' })
  for (const key of ['status', 'userId', 'vehicleId']) {
    if (filters[key]) query.set(key, filters[key])
  }
  const response = await apiRequest(`/api/admin/reservations?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return {
    reservations: unwrapList(response),
    pagination: normalizePagination(response?.meta, filters.page),
  }
}

export async function getAdminReservation(id, token, signal) {
  const response = await apiRequest(
    `/api/admin/reservations/${encodeURIComponent(id)}`,
    { headers: { Authorization: `Bearer ${token}` }, signal },
  )
  return unwrapData(response)
}

export async function updateAdminReservationStatus(id, status, token) {
  const response = await apiRequest(
    `/api/admin/reservations/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { status },
    },
  )
  return unwrapData(response)
}
