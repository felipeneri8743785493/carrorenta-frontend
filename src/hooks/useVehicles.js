import { useEffect, useState } from 'react'
import { getVehicles } from '../services/vehicleService'
import { getLastPage } from '../utils/pagination'

const initialState = {
  vehicles: [],
  pagination: { currentPage: 1, totalItems: 0, totalPages: 1 },
  error: null,
  requestKey: null,
}

export function useVehicles({ category, endDate, onPageOutOfRange, page, startDate, transmission }) {
  const [state, setState] = useState(initialState)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = [category, endDate, page, startDate, transmission, reloadKey].join('|')

  useEffect(() => {
    const controller = new AbortController()
    getVehicles({ category, endDate, page, startDate, transmission }, controller.signal)
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
  }, [category, endDate, onPageOutOfRange, page, requestKey, startDate, transmission, reloadKey])

  return {
    ...state,
    isLoading: state.requestKey !== requestKey,
    reload: () => {
      setReloadKey((current) => current + 1)
    },
  }
}
