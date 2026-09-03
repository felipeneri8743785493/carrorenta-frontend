function normalizeApiUrl(value) {
  const configuredUrl = String(value ?? '').trim()
  if (!configuredUrl || configuredUrl === '/') return { url: '', isValid: true }
  if (configuredUrl.startsWith('/') && !configuredUrl.startsWith('//')) {
    return { url: configuredUrl.replace(/\/+$/, ''), isValid: true }
  }

  try {
    const url = new URL(configuredUrl)
    const isValid = ['http:', 'https:'].includes(url.protocol)
      && !url.username
      && !url.password
      && !url.search
      && !url.hash
    return {
      url: isValid ? url.toString().replace(/\/+$/, '') : '',
      isValid,
    }
  } catch {
    return { url: '', isValid: false }
  }
}

const apiConfiguration = normalizeApiUrl(import.meta.env.VITE_API_URL)
const REQUEST_TIMEOUT_MS = 20000
let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null
  }
}

export class ApiError extends Error {
  constructor(message, { code, status, requestId, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.requestId = requestId
    this.details = details
  }
}

async function readResponseData(response) {
  if (response.status === 204 || response.status === 205) return null

  const text = await response.text()
  if (!text) return null

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return text

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function performRequest(path, options) {
  const { body, headers, signal, ...requestOptions } = options
  const requestHeaders = {
    Accept: 'application/json',
    ...(body !== undefined && { 'Content-Type': 'application/json' }),
    ...headers,
  }
  const controller = new AbortController()
  let timedOut = false
  let abortedByCaller = false
  const abortRequest = () => {
    abortedByCaller = true
    controller.abort()
  }
  if (signal?.aborted) abortRequest()
  else signal?.addEventListener('abort', abortRequest, { once: true })
  const timeoutId = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(apiConfiguration.url + path, {
      ...requestOptions,
      headers: requestHeaders,
      signal: controller.signal,
      ...(body !== undefined && {
        body: typeof body === 'string' ? body : JSON.stringify(body),
      }),
    })
    const requestId = response.headers.get('X-Request-Id')
    const data = await readResponseData(response)

    if (!response.ok) {
      const isAuthenticatedRequest = Object.keys(requestHeaders)
        .some((name) => name.toLowerCase() === 'authorization')
      const isCredentialCheck = path === '/api/auth/me/password'
      if (response.status === 401 && isAuthenticatedRequest && !isCredentialCheck) {
        unauthorizedHandler?.()
      }

      throw new ApiError(
        typeof data?.message === 'string'
          ? data.message
          : 'No fue posible completar la solicitud.',
        { status: response.status, requestId, details: data },
      )
    }

    return data
  } catch (error) {
    if (timedOut && !abortedByCaller) {
      throw new ApiError(
        'El servidor tardó demasiado en responder. Inténtalo nuevamente.',
        { code: 'REQUEST_TIMEOUT' },
      )
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortRequest)
  }
}

export async function apiRequest(path, options = {}) {
  try {
    if (!apiConfiguration.isValid) {
      throw new ApiError(
        'La URL del servidor no es válida. Revisa la configuración de VITE_API_URL.',
        { code: 'API_CONFIG_ERROR' },
      )
    }
    return await performRequest(path, options)
  } catch (error) {
    if (error instanceof ApiError || error?.name === 'AbortError') throw error
    throw new ApiError(
      'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.',
      { code: 'NETWORK_ERROR' },
    )
  }
}
