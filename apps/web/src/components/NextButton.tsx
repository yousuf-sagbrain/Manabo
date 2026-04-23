import type { QuizState } from '../hooks/useQuiz'

interface NextButtonProps {
  state: QuizState
  onNext: () => void
  onSubmit: () => void
}

const BTN_BASE =
  'w-full h-14 min-h-[44px] rounded-2xl bg-purple-500 text-white font-semibold text-lg ' +
  'active:scale-95 transition-transform duration-150 shadow-md touch-manipulation ' +
  'hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300'

export function NextButton({ state, onNext, onSubmit }: NextButtonProps) {
  const answered = state !== 'answering'

  if (!answered) {
    return (
      <button
        type="button"
        onClick={onSubmit}
        className={BTN_BASE}
        aria-label="Submit answer"
      >
        Check
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onNext}
      className={`${BTN_BASE} animate-fade-in`}
      aria-label="Next character"
    >
      Next →
    </button>
  )
}
