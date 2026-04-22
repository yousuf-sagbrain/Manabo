import { useState, useCallback, useRef } from 'react'
import { hiragana, type HiraganaChar } from '../data/hiragana'

export type QuizState = 'answering' | 'correct' | 'incorrect'

export interface QuizSession {
  correct: number
  incorrect: number
  streak: number
  total: number
}

export interface UseQuizReturn {
  current: HiraganaChar
  input: string
  state: QuizState
  session: QuizSession
  setInput: (value: string) => void
  submit: () => void
  next: () => void
}

function pickRandom(exclude: string | null): HiraganaChar {
  const pool = exclude ? hiragana.filter(h => h.char !== exclude) : hiragana
  return pool[Math.floor(Math.random() * pool.length)]
}

function isCorrect(input: string, char: HiraganaChar): boolean {
  const normalised = input.trim().toLowerCase()
  return normalised === char.romaji || char.aliases.includes(normalised)
}

export function useQuiz(): UseQuizReturn {
  const [current, setCurrent] = useState<HiraganaChar>(() => pickRandom(null))
  const [input, setInput] = useState('')
  const [state, setState] = useState<QuizState>('answering')
  const [session, setSession] = useState<QuizSession>({
    correct: 0,
    incorrect: 0,
    streak: 0,
    total: 0,
  })

  const lastCharRef = useRef<string | null>(null)

  const submit = useCallback(() => {
    if (state !== 'answering' || input.trim() === '') return

    const correct = isCorrect(input, current)
    setState(correct ? 'correct' : 'incorrect')
    setSession(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      streak: correct ? prev.streak + 1 : 0,
      total: prev.total + 1,
    }))
  }, [state, input, current])

  const next = useCallback(() => {
    if (state === 'answering') return
    lastCharRef.current = current.char
    setCurrent(pickRandom(lastCharRef.current))
    setInput('')
    setState('answering')
  }, [state, current])

  return { current, input, state, session, setInput, submit, next }
}
