import { apiRequest } from '../api/client'
import { unwrapData } from '../api/response'

const TOKEN_KEY = 'carrorenta_token'
const headers = (token) => ({ Authorization: `Bearer ${token}` })

function extractToken(response) {
  const payload = unwrapData(response)
  return payload?.token ?? payload?.accessToken ?? payload?.jwt
}

export const getStoredToken = () => window.localStorage.getItem(TOKEN_KEY)
export const storeToken = (token) => window.localStorage.setItem(TOKEN_KEY, token)
export const clearStoredToken = () => window.localStorage.removeItem(TOKEN_KEY)

export async function login(credentials) {
  const response = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
  const token = extractToken(response)
  if (!token) throw new Error('La respuesta de autenticación no incluyó un token.')
  return { token, user: unwrapData(response)?.user ?? null }
}

export async function register(userData) {
  const response = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: userData,
  })
  return { token: extractToken(response), user: unwrapData(response)?.user ?? null }
}

export async function getCurrentUser(token) {
  const payload = unwrapData(await apiRequest('/api/auth/me', {
    headers: headers(token),
  }))
  return payload?.user ?? payload
}

export async function updateProfile(changes, token) {
  const payload = unwrapData(await apiRequest('/api/auth/me', {
    method: 'PATCH',
    headers: headers(token),
    body: changes,
  }))
  return payload?.user ?? payload
}

export async function changePassword(passwords, token) {
  await apiRequest('/api/auth/me/password', {
    method: 'PATCH',
    headers: headers(token),
    body: passwords,
  })
}

export async function logout(token) {
  await apiRequest('/api/auth/logout', {
    method: 'POST',
    headers: headers(token),
  })
}
