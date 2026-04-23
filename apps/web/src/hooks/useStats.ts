import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { UserStats } from '../lib/api'

export function useStats() {
  const [stats,   setStats]   = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.users.myStats()
      setStats(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { stats, loading, error, refresh }
}
