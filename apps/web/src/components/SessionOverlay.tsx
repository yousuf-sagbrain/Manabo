import mascotSadSvg from '../assets/mascot_sad.svg'

interface SessionStats {
  correct:   number
  incorrect: number
  streak:    number
}

interface SessionOverlayProps {
  stats:   SessionStats
  onRetry: () => void
}

export function SessionOverlay({ stats, onRetry }: SessionOverlayProps) {
  const total    = stats.correct + stats.incorrect
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Out of hearts"
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(15,23,42,0.5)' }}
    >
      <div className="bg-white rounded-2xl p-8 w-full max-w-xs flex flex-col items-center gap-6"
           style={{ boxShadow: '0 8px 0 rgba(30,44,92,0.05), 0 16px 32px rgba(30,44,92,0.10)' }}>

        <img src={mascotSadSvg} alt="" aria-hidden="true" className="w-28 h-28 object-contain" />

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-black text-navy-800">So close.</h2>
          <p className="text-sm text-slate-500">Let's practise a bit more and try again soon.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { label: 'Correct',  value: stats.correct,  colour: 'text-green-600' },
            { label: 'Wrong',    value: stats.incorrect, colour: 'text-rose-500' },
            { label: 'Accuracy', value: `${accuracy}%`, colour: 'text-navy-600' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 bg-slate-50 rounded-xl py-3 border-2 border-slate-100">
              <span className={`text-lg font-black tabular-nums ${s.colour}`}>{s.value}</span>
              <span className="text-xs text-slate-500 font-bold">{s.label}</span>
            </div>
          ))}
        </div>

        {stats.streak > 0 && (
          <p className="text-sm text-amber-500 font-extrabold">
            Best streak this session: {stats.streak} 🔥
          </p>
        )}

        <button onClick={onRetry} className="btn-primary" autoFocus>
          Try again
        </button>
      </div>
    </div>
  )
}
