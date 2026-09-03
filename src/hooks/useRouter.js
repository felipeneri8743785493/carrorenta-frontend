import { useCallback, useEffect, useState } from 'react'
import { normalizePathname } from '../utils/routes'

export function useRouter() {
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname))
  const [search, setSearch] = useState(() => window.location.search)

  useEffect(() => {
    const normalizedPath = normalizePathname(window.location.pathname)
    if (normalizedPath !== window.location.pathname) {
      window.history.replaceState({}, '', `${normalizedPath}${window.location.search}${window.location.hash}`)
    }

    const handlePopState = () => {
      setPathname(normalizePathname(window.location.pathname))
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((to, { replace = false, state = null } = {}) => {
    const destination = new URL(to, window.location.origin)
    const normalizedPath = normalizePathname(destination.pathname)
    const normalizedLocation = `${normalizedPath}${destination.search}${destination.hash}`
    const currentLocation = `${normalizePathname(window.location.pathname)}${window.location.search}${window.location.hash}`
    if (normalizedLocation === currentLocation) return
    const updateHistory = replace ? 'replaceState' : 'pushState'
    window.history[updateHistory](state, '', normalizedLocation)
    setPathname(normalizedPath)
    setSearch(destination.search)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [])

  return { navigate, pathname, search }
}
