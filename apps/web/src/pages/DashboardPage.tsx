import { useState } from 'react'
import { useLocation }   from 'wouter'
import { useStats }      from '../hooks/useStats'
import { useAuth }       from '../hooks/useAuth'
import { XPBar }         from '../components/XPBar'
import { MasteryBar }    from '../components/MasteryBar'
import { BadgeGrid }     from '../components/BadgeGrid'
import { LeaderboardModal } from '../components/LeaderboardModal'
import manaboLogo        from '../assets/manabo_logo.png'
import learnSvg          from '../assets/learn.svg'
import questsSvg         from '../assets/quests.svg'
import finishSvg         from '../assets/finish.svg'

export function DashboardPage() {
  const [, setLocation] = useLocation()
  const { user, logout } = useAuth()
  const { stats, loading, error } = useStats()
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafbfd]">
      <LeaderboardModal
        open={leaderboardOpen}
        onOpenChange={setLeaderboardOpen}
        yourRankFallback={stats?.rank}
      />

      {/* Sticky header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3
                          bg-white/90 border-b-2 border-slate-100"
              style={{ backdropFilter: 'blur(8px)' }}>
        <img src={manaboLogo} alt="Manabo" className="h-8 w-auto object-contain" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLeaderboardOpen(true)}
            className="text-sm text-amber-500 hover:text-amber-700 font-extrabold touch-manipulation
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded"
            aria-label="Leaderboard"
          >
            🏆
          </button>
          <button
            onClick={logout}
            className="text-xs font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-widest
                       touch-manipulation focus-visible:outline-none"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="w-full max-w-sm mx-auto px-4 py-6 flex flex-col gap-5">

        {loading && !stats && (
          <div className="flex items-center justify-center py-16 text-slate-400 font-bold">
            Loading your stats…
          </div>
        )}

        {error && !stats && (
          <div role="alert" className="text-rose-500 text-sm text-center py-4 font-bold">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Welcome banner */}
            <section
              className="rounded-2xl p-5 text-white"
              style={{ background: '#1e2c5c', borderBottom: '6px solid #172147' }}
            >
              <div className="text-xs font-extrabold uppercase tracking-widest opacity-80 mb-1">
                Welcome back
              </div>
              <h2 className="text-2xl font-black">
                {user?.full_name ?? user?.applicant_id}
              </h2>
              {stats.streak_days > 0 && (
                <p className="text-sm mt-1.5 opacity-90">
                  You're on a {stats.streak_days}-day streak. Keep it alive. 🔥
                </p>
              )}
            </section>

            {/* Pick one */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Pick one</h3>
              <div className="flex flex-col gap-3">
                {/* Learn */}
                <button
                  onClick={() => setLocation('/')}
                  className="flex items-center gap-4 w-full text-left px-4 py-4 rounded-2xl
                             bg-white border-2 border-slate-200 cursor-pointer
                             hover:bg-slate-50 transition-colors duration-[120ms] touch-manipulation"
                  style={{ borderBottomWidth: 4, borderBottomColor: '#dde3ee' }}
                >
                  <img src={learnSvg} alt="" className="w-11 h-11 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-navy-800">Practice</div>
                    <div className="text-sm text-slate-400 mt-0.5">Self-check — unlimited</div>
                  </div>
                  <span className="text-2xl text-slate-300">›</span>
                </button>

                {/* Practice (kana chart) */}
                <button
                  onClick={() => setLocation('/chart')}
                  className="flex items-center gap-4 w-full text-left px-4 py-4 rounded-2xl
                             bg-white border-2 border-slate-200 cursor-pointer
                             hover:bg-slate-50 transition-colors duration-[120ms] touch-manipulation"
                  style={{ borderBottomWidth: 4, borderBottomColor: '#dde3ee' }}
                >
                  <img src={questsSvg} alt="" className="w-11 h-11 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-navy-800">Hiragana &amp; Katakana chart</div>
                    <div className="text-sm text-slate-400 mt-0.5">All 92 characters · tap to review</div>
                  </div>
                  <span className="text-2xl text-slate-300">›</span>
                </button>

                {/* Mastery test — amber highlight */}
                <button
                  onClick={() => setLocation('/')}
                  className="flex items-center gap-4 w-full text-left px-4 py-4 rounded-2xl
                             cursor-pointer transition-colors duration-[120ms] touch-manipulation"
                  style={{
                    background: '#fffbeb',
                    border: '2px solid #fcd34d',
                    borderBottomWidth: 4,
                    borderBottomColor: '#f59e0b',
                  }}
                >
                  <img src={finishSvg} alt="" className="w-11 h-11 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-amber-700">Mastery test</div>
                    <div className="text-sm text-amber-600/70 mt-0.5">20 Q · 10 min · 80% to pass</div>
                  </div>
                  <span className="text-2xl text-amber-400">›</span>
                </button>
              </div>
            </div>

            {/* Stats row */}
            <section
              role="group"
              aria-label="Practice statistics"
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: 'Sessions',    value: stats.total_sessions,     colour: 'text-navy-600' },
                { label: 'Tests passed', value: stats.tests_passed,      colour: 'text-green-600' },
                { label: 'Accuracy',    value: `${stats.accuracy_overall}%`, colour: 'text-amber-600' },
              ].map(s => (
                <div key={s.label}
                     className="bg-white rounded-2xl border-2 border-slate-100 p-3 flex flex-col items-center gap-0.5"
                     style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
                  <span className={`text-lg font-black tabular-nums ${s.colour}`}>{s.value}</span>
                  <span className="text-xs text-slate-400 font-bold text-center">{s.label}</span>
                </div>
              ))}
            </section>

            {/* XP + Level */}
            <section className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col gap-3"
                     style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Level</p>
                  <p className="text-2xl font-black text-navy-800">{stats.level}</p>
                </div>
                <span className="text-xs font-bold text-slate-400">Rank #{stats.rank}</span>
              </div>
              <XPBar xp={stats.xp} level={stats.level} xpToNext={stats.xp_to_next_level} />
            </section>

            {/* Progress */}
            <section className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col gap-4"
                     style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Progress</h2>
              <MasteryBar label="Hiragana" mastered={stats.mastered_hiragana} total={stats.total_hiragana} />
              <MasteryBar label="Katakana" mastered={stats.mastered_katakana} total={stats.total_katakana} />
            </section>

            {/* Today's goal */}
            <section className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col gap-2.5"
                     style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-navy-700">Today's goal</span>
                <span className="text-slate-500 tabular-nums">{stats.correct_today} / 20 correct</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    stats.correct_today >= 20 ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min((stats.correct_today / 20) * 100, 100)}%` }}
                />
              </div>
              {stats.correct_today >= 20 && (
                <p className="text-xs text-green-600 font-extrabold text-center">
                  🎉 Daily goal reached! Beautiful work.
                </p>
              )}
            </section>

            {/* Weak areas */}
            {stats.weak_characters.length > 0 && (
              <section className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col gap-3"
                       style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
                <div>
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Focus areas</h2>
                  <p className="text-xs text-slate-400 mt-1">Characters that need more practice</p>
                </div>
                <div className="flex flex-col gap-2">
                  {stats.weak_characters.map(w => (
                    <div
                      key={w.character}
                      className="flex items-center justify-between bg-rose-50 rounded-xl px-4 py-2.5
                                 border-2 border-rose-100"
                    >
                      <span className="font-kana text-2xl text-navy-800 font-bold">{w.character}</span>
                      <span className="text-sm text-slate-500 font-bold font-mono">{w.romaji}</span>
                      <span className="text-sm font-extrabold text-rose-500">{w.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            <section className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col gap-4"
                     style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Achievements ({stats.badges.length} / 9)
              </h2>
              <BadgeGrid earned={stats.badges} />
            </section>

            {/* CTA */}
            <button onClick={() => setLocation('/')} className="btn-primary">
              Continue learning
            </button>
          </>
        )}
      </div>
    </div>
  )
}
