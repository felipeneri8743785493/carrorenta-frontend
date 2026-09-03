import { useEffect, useState } from 'react'
import { getAdminReservations } from '../services/adminReservationService'
import { getLastPage } from '../utils/pagination'

const initial = {
  reservations: [],
  pagination: { currentPage: 1, totalItems: 0, totalPages: 1 },
  error: null,
  requestKey: null,
}

export function useAdminReservations(filters, token, onPageOutOfRange) {
  const [state, setState] = useState(initial)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = `${JSON.stringify(filters)}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()
    getAdminReservations(filters, token, controller.signal)
      .then((data) => {
        const lastPage = getLastPage(data.pagination)
        if (filters.page > lastPage) {
          onPageOutOfRange(lastPage)
          return
        }
        setState({ ...data, error: null, requestKey })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ ...initial, error, requestKey })
      })
    return () => controller.abort()
  }, [filters, onPageOutOfRange, reloadKey, requestKey, token])

  return { ...state, isLoading: state.requestKey !== requestKey, reload: () => setReloadKey((value) => value + 1) }
}
