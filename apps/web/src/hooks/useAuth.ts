import { useState, useCallback } from 'react'
import { api, type AuthUser } from '../lib/api'

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('manabo_user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (applicantId: string, name?: string) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(loadUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (applicantId: string, name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const { token, user: userInfo } = await api.auth.login(applicantId, name)
      localStorage.setItem('manabo_token', token)
      localStorage.setItem('manabo_user', JSON.stringify(userInfo))
      setUser(userInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('manabo_token')
    localStorage.removeItem('manabo_user')
    setUser(null)
  }, [])

  return { user, loading, error, login, logout }
}
