interface XPBarProps {
  xp:           number
  level:        number
  xpToNext:     number
}

export function XPBar({ xp, level, xpToNext }: XPBarProps) {
  const xpIntoLevel  = 500 - xpToNext
  const pct          = Math.round((xpIntoLevel / 500) * 100)

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-purple-700">⚡ {xp} XP</span>
        <span className="text-gray-500">{xpToNext} XP to Level {level + 1}</span>
      </div>
      <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
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
