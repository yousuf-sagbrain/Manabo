interface XPBarProps {
  xp:       number
  level:    number
  xpToNext: number
}

export function XPBar({ xp, level, xpToNext }: XPBarProps) {
  const xpIntoLevel = 500 - xpToNext
  const pct         = Math.round((xpIntoLevel / 500) * 100)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-extrabold">
        <span className="text-amber-600">⚡ {xp} XP</span>
        <span className="text-slate-400">{xpToNext} to Level {level + 1}</span>
      </div>
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP progress: ${pct}%`}
        />
      </div>
    </div>
  )
}
