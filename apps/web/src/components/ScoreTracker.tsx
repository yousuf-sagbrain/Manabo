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
      className="grid grid-cols-4 w-full gap-1"
    >
      <Stat label="Correct"   value={session.correct}           colour="text-emerald-600" />
      <Stat label="Incorrect" value={session.incorrect}         colour="text-rose-500"    />
      <Stat label="Accuracy"  value={`${accuracy}%`}            colour="text-purple-600"  />
      <Stat label="Streak"    value={session.streak} suffix="🔥" colour="text-amber-500"  />
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
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <span className={`text-base sm:text-lg font-bold tabular-nums leading-tight ${colour}`}>
        {value}{suffix}
      </span>
      <span className="text-xs text-gray-600 font-medium truncate w-full text-center">{label}</span>
    </div>
  )
}
