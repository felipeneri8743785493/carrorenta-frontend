import { apiRequest } from '../api/client'
import { unwrapData } from '../api/response'

function normalizeMetric(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

function normalizeBreakdown(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value).map(([status, total]) => [status, normalizeMetric(total)]),
  )
}

function normalizeStats(response) {
  const stats = unwrapData(response)
  return {
    users: {
      total: normalizeMetric(stats?.users?.total),
    },
    vehicles: {
      total: normalizeMetric(stats?.vehicles?.total),
      byStatus: normalizeBreakdown(stats?.vehicles?.byStatus),
    },
    reservations: {
      total: normalizeMetric(stats?.reservations?.total),
      completedRevenue: normalizeMetric(stats?.reservations?.completedRevenue),
      byStatus: normalizeBreakdown(stats?.reservations?.byStatus),
    },
  }
}

export async function getAdminStats(token, signal) {
  const response = await apiRequest('/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return normalizeStats(response)
}
