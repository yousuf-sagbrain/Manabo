interface SessionStats {
  correct:   number
  incorrect: number
  streak:    number
}

interface SessionOverlayProps {
  stats:    SessionStats
  onRetry:  () => void
}

export function SessionOverlay({ stats, onRetry }: SessionOverlayProps) {
  const total    = stats.correct + stats.incorrect
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Session over"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl" aria-hidden="true">💔</span>
          <h2 className="text-xl font-bold text-gray-800 mt-2">Out of hearts!</h2>
          <p className="text-sm text-gray-500 text-center">Don't give up — try again!</p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { label: 'Correct',   value: stats.correct },
            { label: 'Wrong',     value: stats.incorrect },
            { label: 'Accuracy',  value: `${accuracy}%` },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 bg-gray-50 rounded-2xl py-3">
              <span className="text-lg font-bold text-purple-700 tabular-nums">{s.value}</span>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        {stats.streak > 0 && (
          <p className="text-sm text-amber-500 font-semibold">
            Best streak this session: {stats.streak} 🔥
          </p>
        )}

        <button
          onClick={onRetry}
          className="w-full h-12 rounded-2xl bg-purple-500 text-white font-semibold text-base
            shadow-md hover:bg-purple-600 active:scale-95 transition-transform
            touch-manipulation focus-visible:outline-none focus-visible:ring-4
            focus-visible:ring-purple-300"
          autoFocus
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
