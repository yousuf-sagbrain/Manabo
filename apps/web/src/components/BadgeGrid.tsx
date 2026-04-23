import { BADGE_META, ALL_BADGE_KEYS } from '../data/badges'

interface BadgeGridProps {
  earned: { badge_key: string; earned_at: string }[]
}

export function BadgeGrid({ earned }: BadgeGridProps) {
  const earnedSet = new Set(earned.map(b => b.badge_key))

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {ALL_BADGE_KEYS.map(key => {
        const meta       = BADGE_META[key]
        const isEarned   = earnedSet.has(key)
        const earnedDate = earned.find(b => b.badge_key === key)?.earned_at

        return (
          <div
            key={key}
            title={isEarned ? `${meta.label} — earned ${new Date(earnedDate!).toLocaleDateString()}` : meta.desc}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all
              ${isEarned
                ? 'bg-amber-50 border-amber-200'
                : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
              }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">{meta.icon}</span>
            <span className="text-xs font-semibold text-center leading-tight text-gray-700">{meta.label}</span>
            {!isEarned && (
              <span className="text-xs text-gray-400 text-center leading-tight">{meta.desc}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
