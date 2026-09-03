import { apiRequest } from '../api/client'
import { unwrapData, unwrapList } from '../api/response'
import { normalizePagination } from '../utils/pagination'

const PAGE_SIZE = 10

export async function getAdminVehicles(filters, token, signal) {
  const query = new URLSearchParams({
    page: String(filters.page),
    limit: String(PAGE_SIZE),
  })
  if (filters.status) query.set('status', filters.status)

  const response = await apiRequest(`/api/admin/vehicles?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return {
    vehicles: unwrapList(response),
    pagination: normalizePagination(response?.meta, filters.page),
  }
}

export async function getAdminVehicle(id, token, signal) {
  const response = await apiRequest(
    `/api/admin/vehicles/${encodeURIComponent(id)}`,
    { headers: { Authorization: `Bearer ${token}` }, signal },
  )
  return unwrapData(response)
}

export async function updateAdminVehicle(id, changes, token) {
  const response = await apiRequest(
    `/api/admin/vehicles/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: changes,
    },
  )
  return unwrapData(response)
}

export async function createAdminVehicle(vehicle, token) {
  const response = await apiRequest('/api/admin/vehicles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: vehicle,
  })
  return unwrapData(response)
}

export async function deactivateAdminVehicle(id, token) {
  const response = await apiRequest(
    `/api/admin/vehicles/${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
  )
  return unwrapData(response)
}
