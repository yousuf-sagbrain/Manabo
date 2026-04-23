import { useState, useEffect, useRef } from 'react'
import { Switch, Route, useLocation } from 'wouter'
import manaboLogo from './assets/manabo_logo.png'
import { useQuiz }         from './hooks/useQuiz'
import { useAuth }         from './hooks/useAuth'
import { useStats }        from './hooks/useStats'
import { CharacterCard }   from './components/CharacterCard'
import { InputField }      from './components/InputField'
import { FeedbackDisplay } from './components/FeedbackDisplay'
import { ScoreTracker }    from './components/ScoreTracker'
import { NextButton }      from './components/NextButton'
import { LoginScreen }     from './components/LoginScreen'
import { Confetti }        from './components/Confetti'
import { XPToast }         from './components/XPToast'
import { HeartsDisplay }   from './components/HeartsDisplay'
import { SessionOverlay }  from './components/SessionOverlay'
import { MultipleChoiceOptions } from './components/MultipleChoiceOptions'
import { DashboardPage }   from './pages/DashboardPage'
import { KanaChartPage }  from './pages/KanaChartPage'
import { AdminPage }       from './pages/AdminPage'
import { useHearts }       from './hooks/useHearts'
import type { ScriptMode, QuizMode } from './hooks/useQuiz'

const STREAK_MILESTONES = new Set([5, 10, 20, 30])

const SCRIPT_OPTIONS: { value: ScriptMode; label: string }[] = [
  { value: 'hiragana', label: 'Hiragana' },
  { value: 'katakana', label: 'Katakana' },
  { value: 'both',     label: 'Mixed' },
]

const MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'typing',          label: 'Typing' },
  { value: 'multiple-choice', label: 'Choice' },
]

function QuizPage() {
  const { user, logout }    = useAuth()
  const [, setLocation]     = useLocation()
  const [script, setScript] = useState<ScriptMode>('hiragana')
  const [mode,   setMode]   = useState<QuizMode>('typing')

  const { current, dataset, input, state, session, setInput, submit, submitSelection, next } =
    useQuiz(user?.id, script, mode)

  const { stats, refresh: refreshStats } = useStats()
  const { hearts, maxHearts, loseHeart, resetHearts, hasLives } = useHearts()

  const prevCorrectRef  = useRef(0)
  const prevStreakRef   = useRef(0)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [xpToastTrigger,  setXpToastTrigger]  = useState(0)

  useEffect(() => {
    const prev = prevStreakRef.current
    prevStreakRef.current = session.streak
    if (session.streak !== prev && STREAK_MILESTONES.has(session.streak)) {
      setConfettiTrigger(t => t + 1)
    }
  }, [session.streak])

  useEffect(() => {
    const prev = prevCorrectRef.current
    prevCorrectRef.current = session.correct
    if (session.correct > prev) setXpToastTrigger(t => t + 1)
  }, [session.correct])

  useEffect(() => {
    if (state === 'incorrect') loseHeart()
  }, [state])

  useEffect(() => {
    if (state === 'correct' || state === 'incorrect') refreshStats()
  }, [state, refreshStats])

  function handleRetry() {
    resetHearts()
    next()
  }

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <XPToast trigger={xpToastTrigger} />
      {!hasLives && <SessionOverlay stats={session} onRetry={handleRetry} />}

      {/* Sticky app header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3
                          bg-white/90 border-b-2 border-slate-100"
              style={{ backdropFilter: 'blur(8px)' }}>
        <img src={manaboLogo} alt="Manabo" className="h-8 w-auto object-contain" />

        <div className="flex items-center gap-1.5">
          {stats && (
            <>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200
                               rounded-full px-2.5 py-0.5 tabular-nums">
                ⚡ {stats.xp}
              </span>
              {stats.streak_days > 0 && (
                <span className="text-xs font-extrabold text-amber-500 tabular-nums">
                  🔥 {stats.streak_days}
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation('/dashboard')}
            className="text-xs font-extrabold text-navy-500 hover:text-navy-700 uppercase tracking-widest
                       touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded"
          >
            Dashboard
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setLocation('/admin')}
              className="text-xs font-extrabold text-amber-600 hover:text-amber-800 uppercase tracking-widest
                         touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded"
            >
              Admin
            </button>
          )}
          <button
            onClick={logout}
            className="text-xs font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-widest
                       touch-manipulation focus-visible:outline-none rounded"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="min-h-[calc(100vh-56px)] bg-[#fafbfd] flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-sm flex flex-col gap-4">

          {/* User greeting */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 truncate max-w-[180px]">
              {user?.full_name ?? user?.applicant_id}
            </span>
            <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
          </div>

          {/* Script + Mode selectors */}
          <div className="flex flex-col gap-2">
            {/* Script */}
            <div role="group" aria-label="Script selection"
                 className="flex p-1 gap-1 bg-slate-100 rounded-2xl">
              {SCRIPT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setScript(o.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider
                              transition-all duration-[120ms] touch-manipulation
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
                              ${script === o.value
                                ? 'bg-white text-navy-700 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                              }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* Mode */}
            <div role="group" aria-label="Mode selection"
                 className="flex p-1 gap-1 bg-slate-100 rounded-2xl">
              {MODE_OPTIONS.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setMode(o.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider
                              transition-all duration-[120ms] touch-manipulation
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
                              ${mode === o.value
                                ? 'bg-white text-navy-700 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                              }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Score bar */}
          <ScoreTracker session={session} />

          {/* Main quiz area */}
          <main className="flex flex-col gap-4">
            <CharacterCard char={current} />

            {mode === 'typing' ? (
              <InputField value={input} state={state} onChange={setInput} onSubmit={submit} />
            ) : (
              <MultipleChoiceOptions correct={current} dataset={dataset} state={state} onSelect={submitSelection} />
            )}
          </main>

        </div>
      </div>

      {/* Feedback drawer + CTA — fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <FeedbackDisplay state={state} char={current} />
        <div className="bg-[#fafbfd] px-4 pb-6 pt-3 max-w-sm mx-auto">
          {mode === 'typing' && (
            <NextButton state={state} onNext={next} onSubmit={submit} />
          )}
          {mode === 'multiple-choice' && state !== 'answering' && (
            <NextButton state={state} onNext={next} onSubmit={() => {}} />
          )}
        </div>
      </div>
    </>
  )
}

export default function App() {
  const { user, login, loading, error } = useAuth()

  if (!user) {
    return <LoginScreen onLogin={login} loading={loading} error={error} />
  }

  return (
    <Switch>
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/chart" component={KanaChartPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={QuizPage} />
    </Switch>
  )
}
