import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useLeaderboard } from '../hooks/useLeaderboard'
import type { LeaderboardEntry } from '../lib/api'

const PODIUM_STYLE: Record<number, { bg: string; text: string; medal: string }> = {
  1: { bg: 'bg-amber-50  border-amber-300',  text: 'text-amber-700',  medal: '🥇' },
  2: { bg: 'bg-slate-50  border-slate-300',  text: 'text-slate-600',  medal: '🥈' },
  3: { bg: 'bg-orange-50 border-orange-300', text: 'text-orange-700', medal: '🥉' },
}

interface LeaderboardModalProps {
  open:              boolean
  onOpenChange:      (open: boolean) => void
  yourRankFallback?: number | null
}

function EntryRow({ entry, isYou }: { entry: LeaderboardEntry; isYou: boolean }) {
  const podium = PODIUM_STYLE[entry.rank]

  if (podium) {
    return (
      <div className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${podium.bg} ${isYou ? 'ring-2 ring-amber-400' : ''}`}>
        <span className="text-2xl leading-none w-8 text-center">{podium.medal}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-extrabold truncate ${podium.text}`}>{entry.display_name}</p>
          <p className="text-xs text-slate-400 font-bold">Lv.{entry.level} · {entry.streak_days > 0 ? `🔥${entry.streak_days}` : ''}</p>
        </div>
        <span className={`text-sm font-extrabold tabular-nums ${podium.text}`}>⚡ {entry.xp}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 ${isYou ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-300' : 'bg-slate-50 border-slate-100'}`}>
      <span className="text-sm font-extrabold text-slate-400 w-6 text-center tabular-nums">
        {entry.rank}
      </span>
      <p className="flex-1 text-sm font-bold text-navy-700 truncate">{entry.display_name}</p>
      <span className="text-xs text-slate-400 font-bold tabular-nums">Lv.{entry.level}</span>
      <span className="text-sm font-extrabold text-amber-600 tabular-nums">⚡ {entry.xp}</span>
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
        <Dialog.Overlay
          className="fixed inset-0 z-40 data-[state=open]:animate-fade-in"
          style={{ background: 'rgba(15,23,42,0.5)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            w-full max-w-sm bg-white rounded-2xl p-6 flex flex-col gap-4
            focus:outline-none data-[state=open]:animate-slide-up max-h-[85vh] overflow-y-auto"
          style={{ boxShadow: '0 8px 0 rgba(30,44,92,0.05), 0 16px 32px rgba(30,44,92,0.10)' }}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-black text-navy-800">
              🏆 Leaderboard
            </Dialog.Title>
            <Dialog.Close
              className="text-slate-400 hover:text-slate-600 rounded-xl focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-amber-300 p-1"
              aria-label="Close"
            >
              ✕
            </Dialog.Close>
          </div>

          {loading && (
            <p className="text-center text-navy-400 py-8 font-bold">Loading rankings…</p>
          )}

          {error && (
            <p role="alert" className="text-center text-rose-500 text-sm py-4 font-bold">{error}</p>
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
                <p className="text-center text-slate-400 text-sm py-6 font-bold">
                  No rankings yet — be the first!
                </p>
              )}
            </div>
          )}

          {yourRank && data && !data.entries.find(e => e.rank === yourRank) && (
            <p className="text-center text-xs text-slate-400 font-bold pt-1">Your rank: #{yourRank}</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
