import { useEffect, useState } from 'react'
import { getReservation } from '../services/reservationService'

const initialState = { reservation: null, error: null, requestKey: null }

export function useReservation(id, token) {
  const [state, setState] = useState(initialState)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    getReservation(id, token, controller.signal)
      .then((reservation) => setState({ reservation, error: null, requestKey }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ reservation: null, error, requestKey })
        }
      })

    return () => controller.abort()
  }, [id, reloadKey, requestKey, token])

  return { ...state, isLoading: state.requestKey !== requestKey, reload: () => setReloadKey((value) => value + 1) }
}
