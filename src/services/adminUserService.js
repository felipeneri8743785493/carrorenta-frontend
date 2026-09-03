import { apiRequest } from '../api/client'
import { unwrapData, unwrapList } from '../api/response'
import { normalizePagination } from '../utils/pagination'

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` })

export async function getAdminUsers(page, role, token, signal) {
  const query = new URLSearchParams({ page: String(page), limit: '10' })
  if (role) query.set('role', role)
  const response = await apiRequest(`/api/admin/users?${query}`, {
    headers: authHeaders(token),
    signal,
  })
  return {
    users: unwrapList(response),
    pagination: normalizePagination(response?.meta, page),
  }
}

export async function getAdminUser(id, token, signal) {
  const response = await apiRequest(
    `/api/admin/users/${encodeURIComponent(id)}`,
    { headers: authHeaders(token), signal },
  )
  return unwrapData(response)
}

export async function updateAdminUserRole(id, role, token) {
  const response = await apiRequest(
    `/api/admin/users/${encodeURIComponent(id)}/role`,
    { method: 'PATCH', headers: authHeaders(token), body: { role } },
  )
  return unwrapData(response)
}
