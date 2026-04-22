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
}
