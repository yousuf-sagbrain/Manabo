import type { QuizState } from '../hooks/useQuiz'

interface NextButtonProps {
  state:    QuizState
  onNext:   () => void
  onSubmit: () => void
}

export function NextButton({ state, onNext, onSubmit }: NextButtonProps) {
  const answered = state !== 'answering'
  const isCorrect = state === 'correct'

  if (!answered) {
    return (
      <button type="button" onClick={onSubmit} className="btn-secondary" aria-label="Submit answer">
        Check
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onNext}
      aria-label="Next character"
      className={`animate-fade-in ${isCorrect ? 'btn-success' : 'btn-primary'}`}
    >
      Continue
    </button>
  )
}
