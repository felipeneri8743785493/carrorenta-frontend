import { useEffect, useState } from 'react'
import { getVehicleById } from '../services/vehicleService'

const initialState = { vehicle: null, error: null, requestKey: null }

export function useVehicle(id) {
  const [state, setState] = useState(initialState)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()

    getVehicleById(id, controller.signal)
      .then((vehicle) => {
        setState({ vehicle, error: null, requestKey })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setState({ vehicle: null, error, requestKey })
      })

    return () => controller.abort()
  }, [id, reloadKey, requestKey])

  return {
    ...state,
    isLoading: state.requestKey !== requestKey,
    reload: () => {
      setReloadKey((current) => current + 1)
    },
  }
}
