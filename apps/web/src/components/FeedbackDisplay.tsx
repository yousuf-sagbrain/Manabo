import type { QuizState } from '../hooks/useQuiz'
import type { KanaChar } from '../data/types'

interface FeedbackDisplayProps {
  state: QuizState
  char: KanaChar
}

export function FeedbackDisplay({ state, char }: FeedbackDisplayProps) {
  if (state === 'answering') {
    return <div className="h-12" aria-live="polite" aria-atomic="true" />
  }

  const isCorrect = state === 'correct'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`h-12 flex items-center justify-center gap-2 rounded-2xl px-4
        text-base font-semibold animate-fade-in
        ${isCorrect
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-rose-50 text-rose-700'
        }`}
    >
      {isCorrect ? (
        <>
          <span aria-hidden="true">✓</span>
          You got it!
        </>
      ) : (
        <>
          <span aria-hidden="true">✗</span>
          So close! The answer was <strong className="ml-1">{char.romaji}</strong>
        </>
      )}
    </div>
  )
}
