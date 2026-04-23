import { useState, useCallback, useRef, useEffect } from 'react'
import { hiragana } from '../data/hiragana'
import { katakana } from '../data/katakana'
import type { KanaChar } from '../data/types'
import { api } from '../lib/api'

export type QuizState  = 'answering' | 'correct' | 'incorrect'
export type ScriptMode = 'hiragana' | 'katakana' | 'both'
export type QuizMode   = 'typing' | 'multiple-choice'

export interface QuizSession {
  correct:   number
  incorrect: number
  streak:    number
  streakMax: number
  total:     number
}

export interface UseQuizReturn {
  current:         KanaChar
  dataset:         KanaChar[]
  input:           string
  state:           QuizState
  session:         QuizSession
  setInput:        (value: string) => void
  submit:          () => void
  submitSelection: (romaji: string) => void
  next:            () => void
}

const INIT_SESSION: QuizSession = { correct: 0, incorrect: 0, streak: 0, streakMax: 0, total: 0 }

function buildDataset(script: ScriptMode): KanaChar[] {
  if (script === 'hiragana') return hiragana
  if (script === 'katakana') return katakana
  return [...hiragana, ...katakana]
}

function pickRandom(dataset: KanaChar[], exclude: string | null): KanaChar {
  const pool = exclude ? dataset.filter(k => k.char !== exclude) : dataset
  return pool[Math.floor(Math.random() * pool.length)]
}

function checkCorrect(input: string, char: KanaChar): boolean {
  const v = input.trim().toLowerCase()
  return v === char.romaji || char.aliases.includes(v)
}

export function useQuiz(
  userId?: string,
  script: ScriptMode = 'hiragana',
  mode: QuizMode = 'typing',
): UseQuizReturn {
  const dataset = buildDataset(script)

  const [current, setCurrent] = useState<KanaChar>(() => pickRandom(dataset, null))
  const [input,   setInput]   = useState('')
  const [state,   setState]   = useState<QuizState>('answering')
  const [session, setSession] = useState<QuizSession>(INIT_SESSION)

  const lastCharRef      = useRef<string | null>(null)
  const sessionIdRef     = useRef<string | null>(null)
  const sessionRef       = useRef<QuizSession>(INIT_SESSION)
  const startTimeRef     = useRef<number>(Date.now())
  const questionStartRef = useRef<number>(Date.now())

  // Reset quiz when script changes
  useEffect(() => {
    const newDataset = buildDataset(script)
    lastCharRef.current = null
    setCurrent(pickRandom(newDataset, null))
    setInput('')
    setState('answering')
    setSession(INIT_SESSION)
    sessionRef.current = INIT_SESSION
  }, [script])

  // Create backend session when user is present
  useEffect(() => {
    if (!userId) return
    startTimeRef.current     = Date.now()
    questionStartRef.current = Date.now()
    const apiMode   = mode === 'multiple-choice' ? 'multiple_choice' : 'typing'
    const apiScript = script === 'both' ? 'both' : script
    api.practice.createSession(apiScript, apiMode)
      .then(({ session_id }) => { sessionIdRef.current = session_id })
      .catch(() => {})
  }, [userId, script, mode])

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

  const _recordResult = useCallback((correct: boolean, userInput: string) => {
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
        user_input:  userInput,
        is_correct:  correct,
        response_ms: responseMs,
      }).catch(() => {})
    }
  }, [current, userId])

  const submit = useCallback(() => {
    if (state !== 'answering' || input.trim() === '') return
    _recordResult(checkCorrect(input, current), input.trim().toLowerCase())
  }, [state, input, current, _recordResult])

  const submitSelection = useCallback((selectedRomaji: string) => {
    if (state !== 'answering') return
    const correct = selectedRomaji === current.romaji || current.aliases.includes(selectedRomaji)
    _recordResult(correct, selectedRomaji)
  }, [state, current, _recordResult])

  const next = useCallback(() => {
    if (state === 'answering') return
    const ds = buildDataset(script)
    lastCharRef.current      = current.char
    questionStartRef.current = Date.now()
    setCurrent(pickRandom(ds, lastCharRef.current))
    setInput('')
    setState('answering')
  }, [state, current, script])

  return { current, dataset, input, state, session, setInput, submit, submitSelection, next }
}
