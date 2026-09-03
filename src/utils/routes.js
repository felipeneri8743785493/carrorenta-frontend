export function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function decodePathSegment(segment) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return null
  }
}

export function getSafeReturnPath(value, fallback = '/cuenta') {
  if (
    typeof value !== 'string'
    || !value.startsWith('/')
    || value.startsWith('//')
    || value.includes('\\')
  ) return fallback

  const pathname = normalizePathname(value.split(/[?#]/)[0])
  if (['/login', '/registro'].includes(pathname)) return fallback
  return pathname
}
