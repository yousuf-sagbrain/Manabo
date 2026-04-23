import { useState, useCallback } from 'react'
import { api } from '../lib/api'
import type { LeaderboardEntry } from '../lib/api'

interface LeaderboardData {
  entries:   LeaderboardEntry[]
  your_rank: number | null
}

export function useLeaderboard() {
  const [data,    setData]    = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.users.leaderboard()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetch }
}
