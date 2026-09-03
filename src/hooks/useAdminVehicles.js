import { useEffect, useState } from 'react'
import { getAdminVehicles } from '../services/adminVehicleService'
import { getLastPage } from '../utils/pagination'

const initialState = {
  vehicles: [],
  pagination: { currentPage: 1, totalItems: 0, totalPages: 1 },
  error: null,
  requestKey: null,
}

export function useAdminVehicles({ onPageOutOfRange, page, status, token }) {
  const [state, setState] = useState(initialState)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = [page, status, reloadKey].join('|')

  useEffect(() => {
    const controller = new AbortController()
    getAdminVehicles({ page, status }, token, controller.signal)
      .then((data) => {
        const lastPage = getLastPage(data.pagination)
        if (page > lastPage) {
          onPageOutOfRange(lastPage)
          return
        }
        setState({ ...data, error: null, requestKey })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ ...initialState, error, requestKey })
        }
      })
    return () => controller.abort()
  }, [onPageOutOfRange, page, reloadKey, requestKey, status, token])

  return {
    ...state,
    isLoading: state.requestKey !== requestKey,
    reload: () => setReloadKey((value) => value + 1),
  }
}
