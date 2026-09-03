import { getAdminVehicle } from '../services/adminVehicleService'
import { useAdminEntity } from './useAdminEntity'

export function useAdminVehicle(id, token) {
  const { entity: vehicle, ...state } = useAdminEntity(id, token, getAdminVehicle)
  return { ...state, vehicle }
}
