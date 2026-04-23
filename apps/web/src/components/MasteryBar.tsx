interface MasteryBarProps {
  label:    string
  mastered: number
  total:    number
  color:    'purple' | 'pink'
}

const COLOR = {
  purple: 'from-purple-500 to-purple-400',
  pink:   'from-pink-500   to-pink-400',
}

export function MasteryBar({ label, mastered, total, color }: MasteryBarProps) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500 tabular-nums">{mastered} / {total}</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${COLOR[color]} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} mastery: ${pct}%`}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{pct}% mastered</p>
    </div>
  )
}
