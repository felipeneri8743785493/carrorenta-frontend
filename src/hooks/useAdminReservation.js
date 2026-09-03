import { getAdminReservation } from '../services/adminReservationService'
import { useAdminEntity } from './useAdminEntity'

export function useAdminReservation(id, token) {
  const { entity: reservation, ...state } = useAdminEntity(id, token, getAdminReservation)
  return { ...state, reservation }
}
