import { useEffect, useState } from 'react'
import { cancelReservation, getReservations } from '../services/reservationService'
import { getLastPage } from '../utils/pagination'

const empty = {
  reservations: [],
  pagination: { currentPage: 1, totalItems: 0, totalPages: 1 },
  error: null,
  requestKey: null,
}

export function useReservations(token) {
  const [page, setPage] = useState(1)
  const [status, setStatusValue] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [state, setState] = useState(empty)
  const requestKey = [page, status, reloadKey].join('|')

  useEffect(() => {
    const controller = new AbortController()
    getReservations({ page, status }, token, controller.signal)
      .then((data) => {
        const lastPage = getLastPage(data.pagination)
        if (page > lastPage) {
          setPage(lastPage)
          return
        }
        setState({ ...data, error: null, requestKey })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ ...empty, error, requestKey })
        }
      })
    return () => controller.abort()
  }, [page, reloadKey, requestKey, status, token])

  async function cancel(id) {
    await cancelReservation(id, token)
    setReloadKey((value) => value + 1)
  }

  function setStatus(value) {
    setStatusValue(value)
    setPage(1)
  }

  function reload() {
    setReloadKey((value) => value + 1)
  }

  return { ...state, cancel, isLoading: state.requestKey !== requestKey, page, reload, setPage, setStatus, status }
}
