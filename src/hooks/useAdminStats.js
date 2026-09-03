import { useEffect, useState } from 'react'
import { getAdminStats } from '../services/adminStatsService'

const initial = { stats: null, error: null, requestKey: null }

export function useAdminStats(token) {
  const [state, setState] = useState(initial)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = String(reloadKey)

  useEffect(() => {
    const controller = new AbortController()
    getAdminStats(token, controller.signal)
      .then((stats) => setState({ stats, error: null, requestKey }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ stats: null, error, requestKey })
      })
    return () => controller.abort()
  }, [reloadKey, requestKey, token])

  return { ...state, isLoading: state.requestKey !== requestKey, reload: () => setReloadKey((value) => value + 1) }
}
