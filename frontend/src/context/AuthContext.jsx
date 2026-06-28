import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, tokenStore } from '../lib/adminApi'

/**
 * AuthContext — admin authentication state for the dashboard.
 * Persists the Sanctum token in localStorage and exposes login/logout.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, if a token exists, validate it by fetching the current user.
  useEffect(() => {
    let alive = true
    if (!tokenStore.get()) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((u) => alive && setUser(u))
      .catch(() => {
        tokenStore.clear()
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const login = async (email, password) => {
    const { token, user } = await authApi.login({ email, password })
    tokenStore.set(token)
    setUser(user)
    return user
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      /* ignore network errors on logout */
    }
    tokenStore.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
