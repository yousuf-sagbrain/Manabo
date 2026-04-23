import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useLeaderboard } from '../hooks/useLeaderboard'
import type { LeaderboardEntry } from '../lib/api'

const PODIUM_STYLE: Record<number, { bg: string; text: string; medal: string }> = {
  1: { bg: 'bg-amber-50  border-amber-300',  text: 'text-amber-700',  medal: '🥇' },
  2: { bg: 'bg-gray-50   border-gray-300',   text: 'text-gray-600',   medal: '🥈' },
  3: { bg: 'bg-orange-50 border-orange-300', text: 'text-orange-700', medal: '🥉' },
}

interface LeaderboardModalProps {
  open:          boolean
  onOpenChange:  (open: boolean) => void
  yourRankFallback?: number | null
}

function EntryRow({ entry, isYou }: { entry: LeaderboardEntry; isYou: boolean }) {
  const podium = PODIUM_STYLE[entry.rank]

  if (podium) {
    return (
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${podium.bg} ${isYou ? 'ring-2 ring-purple-400' : ''}`}>
        <span className="text-2xl leading-none w-8 text-center">{podium.medal}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate ${podium.text}`}>{entry.display_name}</p>
          <p className="text-xs text-gray-400">Lv.{entry.level} · {entry.streak_days > 0 ? `🔥${entry.streak_days}` : ''}</p>
        </div>
        <span className={`text-sm font-bold tabular-nums ${podium.text}`}>⚡ {entry.xp}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${isYou ? 'bg-purple-50 ring-2 ring-purple-300' : 'bg-gray-50'}`}>
      <span className="text-sm font-semibold text-gray-400 w-6 text-center tabular-nums">
        {entry.rank}
      </span>
      <p className="flex-1 text-sm font-medium text-gray-700 truncate">{entry.display_name}</p>
      <span className="text-xs text-gray-400 tabular-nums">Lv.{entry.level}</span>
      <span className="text-sm font-bold text-purple-600 tabular-nums">⚡ {entry.xp}</span>
    </div>
  )
}

export function LeaderboardModal({ open, onOpenChange, yourRankFallback }: LeaderboardModalProps) {
  const { data, loading, error, fetch } = useLeaderboard()

  useEffect(() => {
    if (open) fetch()
  }, [open])

  const yourRank = data?.your_rank ?? yourRankFallback ?? null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4
            focus:outline-none data-[state=open]:animate-slide-up max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              🏆 Leaderboard
            </Dialog.Title>
            <Dialog.Close
              className="text-gray-400 hover:text-gray-600 rounded focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-purple-400 p-1"
              aria-label="Close"
            >
              ✕
            </Dialog.Close>
          </div>

          {loading && (
            <p className="text-center text-purple-400 py-8 font-medium">Loading rankings…</p>
          )}

          {error && (
            <p role="alert" className="text-center text-rose-500 text-sm py-4">{error}</p>
          )}

          {data && (
            <div className="flex flex-col gap-2">
              {data.entries.map(entry => (
                <EntryRow
                  key={entry.rank}
                  entry={entry}
                  isYou={entry.rank === yourRank}
                />
              ))}
              {data.entries.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6">No rankings yet — be the first!</p>
              )}
            </div>
          )}

          {yourRank && data && !data.entries.find(e => e.rank === yourRank) && (
            <p className="text-center text-xs text-gray-400 pt-1">Your rank: #{yourRank}</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
