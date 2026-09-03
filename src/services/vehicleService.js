import { apiRequest } from '../api/client'
import { unwrapData, unwrapList } from '../api/response'
import { normalizePagination } from '../utils/pagination'
import { VEHICLE_STATUS } from '../utils/vehicleStatuses'

const PAGE_SIZE = 9

export async function getVehicles(filters, signal) {
  const query = new URLSearchParams({ page: String(filters.page), limit: String(PAGE_SIZE) })
  for (const key of ['category', 'transmission']) {
    if (filters[key]) query.set(key, filters[key])
  }
  if (filters.startDate && filters.endDate) {
    query.set('startDate', filters.startDate)
    query.set('endDate', filters.endDate)
  }
  const response = await apiRequest(`/api/vehicles?${query}`, { signal })
  const vehicles = unwrapList(response)
  return {
    vehicles: vehicles.filter((vehicle) => vehicle.status !== VEHICLE_STATUS.INACTIVE),
    pagination: normalizePagination(response?.meta, filters.page),
  }
}

export async function getVehicleById(id, signal) {
  return unwrapData(await apiRequest(`/api/vehicles/${encodeURIComponent(id)}`, { signal }))
}
