import { useState, useCallback, useRef, useEffect } from 'react'
import { hiragana } from '../data/hiragana'
import type { KanaChar } from '../data/types'
import { api } from '../lib/api'

export type QuizState = 'answering' | 'correct' | 'incorrect'

export interface QuizSession {
  correct: number
  incorrect: number
  streak: number
  streakMax: number
  total: number
}

export interface UseQuizReturn {
  current: KanaChar
  input: string
  state: QuizState
  session: QuizSession
  setInput: (value: string) => void
  submit: () => void
  next: () => void
}

const INIT_SESSION: QuizSession = { correct: 0, incorrect: 0, streak: 0, streakMax: 0, total: 0 }

function pickRandom(exclude: string | null): KanaChar {
  const pool = exclude ? hiragana.filter(h => h.char !== exclude) : hiragana
  return pool[Math.floor(Math.random() * pool.length)]
}

function isCorrect(input: string, char: KanaChar): boolean {
  const v = input.trim().toLowerCase()
  return v === char.romaji || char.aliases.includes(v)
}

export function useQuiz(userId?: string): UseQuizReturn {
  const [current, setCurrent] = useState<KanaChar>(() => pickRandom(null))
  const [input, setInput]     = useState('')
  const [state, setState]     = useState<QuizState>('answering')
  const [session, setSession] = useState<QuizSession>(INIT_SESSION)

  const lastCharRef      = useRef<string | null>(null)
  const sessionIdRef     = useRef<string | null>(null)
  const sessionRef       = useRef<QuizSession>(INIT_SESSION)
  const startTimeRef     = useRef<number>(Date.now())
  const questionStartRef = useRef<number>(Date.now())

  // Create backend session when user is present
  useEffect(() => {
    if (!userId) return
    startTimeRef.current     = Date.now()
    questionStartRef.current = Date.now()
    api.practice.createSession('hiragana', 'typing')
      .then(({ session_id }) => { sessionIdRef.current = session_id })
      .catch(() => {})
  }, [userId])

  // Complete session on unmount
  useEffect(() => {
    return () => {
      if (!sessionIdRef.current || !userId) return
      const s = sessionRef.current
      if (s.total === 0) return
      api.practice.completeSession(sessionIdRef.current, {
        correct_count:    s.correct,
        incorrect_count:  s.incorrect,
        streak_max:       s.streakMax,
        duration_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }).catch(() => {})
    }
  }, [userId])

  const submit = useCallback(() => {
    if (state !== 'answering' || input.trim() === '') return

    const correct    = isCorrect(input, current)
    const responseMs = Date.now() - questionStartRef.current

    setState(correct ? 'correct' : 'incorrect')
    setSession(prev => {
      const newStreak = correct ? prev.streak + 1 : 0
      const next: QuizSession = {
        correct:   prev.correct   + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        streak:    newStreak,
        streakMax: Math.max(prev.streakMax, newStreak),
        total:     prev.total + 1,
      }
      sessionRef.current = next
      return next
    })

    if (sessionIdRef.current && userId) {
      api.practice.recordAnswer(sessionIdRef.current, {
        character:   current.char,
        user_input:  input.trim().toLowerCase(),
        is_correct:  correct,
        response_ms: responseMs,
      }).catch(() => {})
    }
  }, [state, input, current, userId])

  const next = useCallback(() => {
    if (state === 'answering') return
    lastCharRef.current      = current.char
    questionStartRef.current = Date.now()
    setCurrent(pickRandom(lastCharRef.current))
    setInput('')
    setState('answering')
  }, [state, current])

  return { current, input, state, session, setInput, submit, next }
}
