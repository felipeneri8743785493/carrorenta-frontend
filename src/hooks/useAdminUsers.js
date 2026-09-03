import { useEffect, useState } from 'react'
import { getAdminUsers } from '../services/adminUserService'
import { getLastPage } from '../utils/pagination'

const initial = { users: [], pagination: { currentPage: 1, totalItems: 0, totalPages: 1 }, error: null, requestKey: null }

export function useAdminUsers(page, role, token, onPageOutOfRange) {
  const [state, setState] = useState(initial)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = [page, role, reloadKey].join('|')

  useEffect(() => {
    const controller = new AbortController()
    getAdminUsers(page, role, token, controller.signal)
      .then((data) => {
        const lastPage = getLastPage(data.pagination)
        if (page > lastPage) {
          onPageOutOfRange(lastPage)
          return
        }
        setState({ ...data, error: null, requestKey })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ ...initial, error, requestKey })
      })
    return () => controller.abort()
  }, [onPageOutOfRange, page, reloadKey, requestKey, role, token])

  return { ...state, isLoading: state.requestKey !== requestKey, reload: () => setReloadKey((value) => value + 1) }
}
