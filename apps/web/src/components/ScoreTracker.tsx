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
      className="flex items-center justify-between w-full px-1"
      aria-label="Session score"
    >
      <Stat label="Correct" value={session.correct} colour="text-emerald-600" />
      <Stat label="Incorrect" value={session.incorrect} colour="text-rose-500" />
      <Stat label="Accuracy" value={`${accuracy}%`} colour="text-purple-600" />
      <Stat label="Streak" value={session.streak} colour="text-amber-500" suffix="🔥" />
    </div>
  )
}

interface StatProps {
  label: string
  value: string | number
  colour: string
  suffix?: string
}

function Stat({ label, value, colour, suffix }: StatProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-lg font-bold tabular-nums ${colour}`}>
        {value}{suffix}
      </span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </div>
  )
}
