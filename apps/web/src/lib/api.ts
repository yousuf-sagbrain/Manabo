// In dev, Vite proxies /api → http://localhost:8000 (no gateway needed)
// In production, set VITE_API_BASE to the gateway URL e.g. https://api.manabo.app
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

function getToken(): string | null {
  return localStorage.getItem('manabo_token')
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export interface AuthUser {
  id: string
  applicant_id: string
  full_name: string | null
  role: 'learner' | 'admin'
  cohort_name: string | null
}

export interface UserStats {
  xp:               number
  streak_days:      number
  level:            number
  xp_to_next_level: number
  rank:             number
  badges:           { badge_key: string; earned_at: string }[]
  mastered_hiragana: number
  mastered_katakana: number
  total_hiragana:    number
  total_katakana:    number
  total_sessions:    number
  tests_passed:      number
  accuracy_overall:  number
  correct_today:     number
  weak_characters:   { character: string; romaji: string; accuracy: number }[]
}

export interface LeaderboardEntry {
  rank:         number
  applicant_id: string
  display_name: string
  xp:           number
  streak_days:  number
  level:        number
}

export const api = {
  auth: {
    login: (applicantId: string, name?: string) =>
      apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ applicant_id: applicantId, name }),
      }),
  },

  practice: {
    createSession: (scriptFilter: string = 'hiragana', mode: string = 'typing') =>
      apiFetch<{ session_id: string }>('/practice/sessions', {
        method: 'POST',
        body: JSON.stringify({ script_filter: scriptFilter, mode }),
      }),

    recordAnswer: (
      sessionId: string,
      payload: { character: string; user_input: string; is_correct: boolean; response_ms?: number },
    ) =>
      apiFetch<void>(`/practice/sessions/${sessionId}/answers`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    completeSession: (
      sessionId: string,
      stats: { correct_count: number; incorrect_count: number; streak_max: number; duration_seconds: number },
    ) =>
      apiFetch<void>(`/practice/sessions/${sessionId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(stats),
      }),
  },

  test: {
    start: () =>
      apiFetch<{ attempt_id: string; attempt_number: number; questions: { id: string; character: string; script_type: string }[] }>(
        '/test/attempts',
        { method: 'POST' },
      ),

    submit: (attemptId: string, answers: { character: string; user_input: string; response_ms?: number }[]) =>
      apiFetch<{ score: number; total: number; accuracy: number; passed: boolean }>(
        `/test/attempts/${attemptId}/submit`,
        { method: 'POST', body: JSON.stringify({ answers }) },
      ),
  },

  users: {
    myStats:     () =>
      apiFetch<UserStats>('/users/me/stats'),

    leaderboard: () =>
      apiFetch<{ entries: LeaderboardEntry[]; your_rank: number | null }>('/users/leaderboard'),
  },

  admin: {
    dashboard: () =>
      apiFetch<{ learner_count: number; logins_today: number; pass_rate: number; avg_study_min_7d: number }>('/admin/dashboard'),

    auditLogins: (page = 1) =>
      apiFetch<{ total: number; page: number; page_size: number; items: Record<string, unknown>[] }>(`/admin/audit/logins?page=${page}`),

    auditSessions: (page = 1) =>
      apiFetch<{ total: number; page: number; page_size: number; items: Record<string, unknown>[] }>(`/admin/audit/sessions?page=${page}`),

    auditTests: (page = 1) =>
      apiFetch<{ total: number; page: number; page_size: number; items: Record<string, unknown>[] }>(`/admin/audit/tests?page=${page}`),

    exportUsers: () => {
      const token = getToken()
      return fetch(`${BASE}/admin/users/export`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    },

    importUsers: (file: File) => {
      const token = getToken()
      const fd = new FormData()
      fd.append('file', file)
      return fetch(`${BASE}/admin/users/import`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      }).then(r => r.json()) as Promise<{ created: number; skipped: number; errors: string[] }>
    },
  },
}
