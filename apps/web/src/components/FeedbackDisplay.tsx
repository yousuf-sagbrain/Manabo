import type { QuizState } from '../hooks/useQuiz'
import type { KanaChar }  from '../data/types'

interface FeedbackDisplayProps {
  state: QuizState
  char:  KanaChar
}

export function FeedbackDisplay({ state, char }: FeedbackDisplayProps) {
  const isAnswered = state !== 'answering'
  const isCorrect  = state === 'correct'

  if (!isAnswered) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        animate-drawer-up
        rounded-t-3xl px-5 pt-5 pb-6
        ${isCorrect
          ? 'bg-green-100 text-green-700'
          : 'bg-rose-100  text-rose-600'
        }
      `}
    >
      <div className="flex items-center gap-2.5 font-black text-xl mb-1.5">
        {isCorrect
          ? <><span aria-hidden="true">🎉</span> You got it!</>
          : <><span aria-hidden="true">💭</span> So close!</>
        }
      </div>
      <p className="text-sm mb-4">
        {isCorrect
          ? <>The reading is <strong className="font-extrabold font-mono">{char.romaji}</strong>. Keep going.</>
          : <>The answer was <strong className="font-extrabold font-mono">{char.romaji}</strong>. Every miss is a learning moment.</>
        }
      </p>
    </div>
  )
}
