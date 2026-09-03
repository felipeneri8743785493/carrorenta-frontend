import { getAdminUser } from '../services/adminUserService'
import { useAdminEntity } from './useAdminEntity'

export function useAdminUser(id, token) {
  const { entity: user, ...state } = useAdminEntity(id, token, getAdminUser)
  return { ...state, user }
}
