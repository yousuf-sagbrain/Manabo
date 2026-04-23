interface MasteryBarProps {
  label:    string
  mastered: number
  total:    number
  color?:   'amber' | 'navy'
}

export function MasteryBar({ label, mastered, total }: MasteryBarProps) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-navy-700">{label}</span>
        <span className="text-slate-500 tabular-nums font-extrabold">{mastered} / {total}</span>
      </div>
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} mastery: ${pct}%`}
        />
      </div>
      <p className="text-xs text-slate-400 text-right font-bold">{pct}% mastered</p>
    </div>
  )
}
