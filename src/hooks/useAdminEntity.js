import { useEffect, useState } from 'react'

const initialState = { entity: null, error: null, requestKey: null }

export function useAdminEntity(id, token, loadEntity) {
  const [state, setState] = useState(initialState)
  const [reloadKey, setReloadKey] = useState(0)
  const requestKey = `${id}|${reloadKey}`

  useEffect(() => {
    const controller = new AbortController()
    loadEntity(id, token, controller.signal)
      .then((entity) => setState({ entity, error: null, requestKey }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ entity: null, error, requestKey })
      })

    return () => controller.abort()
  }, [id, loadEntity, reloadKey, requestKey, token])

  function applyUpdate(changes) {
    setState((current) => ({
      ...current,
      entity: current.entity ? { ...current.entity, ...changes } : current.entity,
    }))
  }

  return {
    applyUpdate,
    entity: state.entity,
    error: state.error,
    isLoading: state.requestKey !== requestKey,
    reload: () => setReloadKey((value) => value + 1),
  }
}
