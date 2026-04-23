import type { QuizSession } from '../hooks/useQuiz'

interface ScoreTrackerProps {
  session: QuizSession
}

export function ScoreTracker({ session }: ScoreTrackerProps) {
  const accuracy = session.total === 0
    ? 0
    : Math.round((session.correct / session.total) * 100)

  return (
    <div
      role="group"
      aria-label="Session score"
      className="flex items-center gap-4 text-xs font-extrabold text-slate-400 uppercase tracking-widest"
    >
      <span className="text-green-600">✓ {session.correct}</span>
      <span className="text-rose-500">✗ {session.incorrect}</span>
      <span className="ml-auto text-navy-500">{accuracy}% acc</span>
      {session.streak > 0 && (
        <span className="text-amber-500">🔥 {session.streak}</span>
      )}
    </div>
  )
}
