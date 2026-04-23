import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { UserStats } from '../lib/api'

const CACHE_KEY = 'manabo_stats_cache'

function readCache(): UserStats | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as UserStats) : null
  } catch {
    return null
  }
}

function writeCache(stats: UserStats) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(stats)) } catch { /* ignore */ }
}

export function useStats() {
  const [stats,   setStats]   = useState<UserStats | null>(readCache)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.users.myStats()
      setStats(data)
      writeCache(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { stats, loading, error, refresh }
}
