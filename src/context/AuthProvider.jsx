import { useEffect, useState } from 'react'
import { setUnauthorizedHandler } from '../api/client'
import {
  changePassword as changePasswordRequest,
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  storeToken,
  updateProfile,
} from '../services/authService'
import { AuthContext } from './AuthContext'

const initialToken = getStoredToken()

export function AuthProvider({ children }) {
  const [session, setSession] = useState({
    user: null,
    token: initialToken,
    isLoading: Boolean(initialToken),
  })

  useEffect(() => setUnauthorizedHandler(() => {
    clearStoredToken()
    setSession({ user: null, token: null, isLoading: false })
  }), [])

  useEffect(() => {
    if (!session.token) return
    const token = session.token
    getCurrentUser(token)
      .then((user) => setSession({ user, token, isLoading: false }))
      .catch(() => {
        clearStoredToken()
        setSession({ user: null, token: null, isLoading: false })
      })
  }, [session.token])

  async function login(credentials) {
    const result = await loginRequest(credentials)
    storeToken(result.token)
    setSession({
      user: result.user,
      token: result.token,
      isLoading: !result.user,
    })
  }

  async function register(userData) {
    const result = await registerRequest(userData)
    if (result.token) {
      storeToken(result.token)
      setSession({
        user: result.user,
        token: result.token,
        isLoading: !result.user,
      })
    }
    return result
  }

  async function updateUser(changes) {
    const response = await updateProfile(changes, session.token)
    const serverChanges = response && typeof response === 'object' && !Array.isArray(response)
      ? response
      : {}
    const user = { ...session.user, ...changes, ...serverChanges }
    setSession((current) => ({ ...current, user }))
    return user
  }

  function changePassword(passwords) {
    return changePasswordRequest(passwords, session.token)
  }

  async function logout() {
    try {
      if (session.token) await logoutRequest(session.token)
    } catch {
      // El cierre local debe completarse aunque el servidor no esté disponible.
    } finally {
      clearStoredToken()
      setSession({ user: null, token: null, isLoading: false })
    }
  }

  const value = {
    ...session,
    isAuthenticated: Boolean(session.token && session.user),
    changePassword,
    login,
    logout,
    register,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
