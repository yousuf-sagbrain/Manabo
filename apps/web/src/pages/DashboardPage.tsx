import { useState } from 'react'
import { useLocation } from 'wouter'
import { useStats }    from '../hooks/useStats'
import { useAuth }     from '../hooks/useAuth'
import { XPBar }       from '../components/XPBar'
import { MasteryBar }  from '../components/MasteryBar'
import { BadgeGrid }   from '../components/BadgeGrid'
import { LeaderboardModal } from '../components/LeaderboardModal'
import manaboLogo      from '../assets/manabo_logo.png'

export function DashboardPage() {
  const [, setLocation] = useLocation()
  const { user, logout } = useAuth()
  const { stats, loading, error } = useStats()
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 px-4 py-8">
      <LeaderboardModal
        open={leaderboardOpen}
        onOpenChange={setLeaderboardOpen}
        yourRankFallback={stats?.rank}
      />
      <div className="w-full max-w-sm mx-auto flex flex-col gap-6">

        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="text-sm text-purple-600 font-medium hover:text-purple-800
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded
              touch-manipulation"
            aria-label="Back to quiz"
          >
            ← Practice
          </button>
          <img src={manaboLogo} alt="Manabo" className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLeaderboardOpen(true)}
              className="text-sm text-amber-500 hover:text-amber-700 font-medium touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
            >
              🏆
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
            >
              Sign out
            </button>
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center py-16 text-purple-400 font-medium">
            Loading your stats…
          </div>
        )}

        {error && (
          <div role="alert" className="text-rose-500 text-sm text-center py-4">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Hero — Level + XP */}
            <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    {user?.full_name ?? user?.applicant_id}
                  </p>
                  <p className="text-2xl font-bold text-purple-700">Level {stats.level}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {stats.streak_days > 0 && (
                    <span className="text-sm font-bold text-amber-500">
                      🔥 {stats.streak_days}-day streak
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Rank #{stats.rank}</span>
                </div>
              </div>
              <XPBar xp={stats.xp} level={stats.level} xpToNext={stats.xp_to_next_level} />
            </section>

            {/* Stats row */}
            <section
              role="group"
              aria-label="Practice statistics"
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: 'Sessions', value: stats.total_sessions },
                { label: 'Tests Passed', value: stats.tests_passed },
                { label: 'Accuracy', value: `${stats.accuracy_overall}%` },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-0.5">
                  <span className="text-lg font-bold text-purple-700 tabular-nums">{s.value}</span>
                  <span className="text-xs text-gray-500 text-center">{s.label}</span>
                </div>
              ))}
            </section>

            {/* Progress */}
            <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Progress</h2>
              <MasteryBar
                label="Hiragana"
                mastered={stats.mastered_hiragana}
                total={stats.total_hiragana}
                color="purple"
              />
              <MasteryBar
                label="Katakana"
                mastered={stats.mastered_katakana}
                total={stats.total_katakana}
                color="pink"
              />
            </section>

            {/* Achievements */}
            <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Achievements ({stats.badges.length} / 9)
              </h2>
              <BadgeGrid earned={stats.badges} />
            </section>

            {/* Weak areas */}
            {stats.weak_characters.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Focus Areas
                </h2>
                <p className="text-xs text-gray-400">Characters that need more practice</p>
                <div className="flex flex-col gap-2">
                  {stats.weak_characters.map(w => (
                    <div
                      key={w.character}
                      className="flex items-center justify-between bg-rose-50 rounded-xl px-4 py-2"
                    >
                      <span className="font-kana text-2xl text-gray-800">{w.character}</span>
                      <span className="text-sm text-gray-500">{w.romaji}</span>
                      <span className="text-sm font-semibold text-rose-500">{w.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Daily goal */}
            <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">Today's goal</span>
                <span className="text-purple-600 tabular-nums">{stats.correct_today} / 20 correct</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    stats.correct_today >= 20
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-purple-400 to-pink-400'
                  }`}
                  style={{ width: `${Math.min((stats.correct_today / 20) * 100, 100)}%` }}
                />
              </div>
              {stats.correct_today >= 20 && (
                <p className="text-xs text-emerald-600 font-semibold text-center">
                  🎉 Daily goal reached!
                </p>
              )}
            </section>

            {/* CTA */}
            <button
              onClick={() => setLocation('/')}
              className="w-full h-14 min-h-[44px] rounded-2xl bg-purple-500 text-white font-semibold
                text-lg shadow-md hover:bg-purple-600 active:scale-95 transition-transform
                touch-manipulation focus-visible:outline-none focus-visible:ring-4
                focus-visible:ring-purple-300"
            >
              Continue Learning →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
