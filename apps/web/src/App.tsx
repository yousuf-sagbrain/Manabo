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
  const { user, logout }  = useAuth()
  const [, setLocation]   = useLocation()
  const [script, setScript] = useState<ScriptMode>('hiragana')
  const [mode,   setMode]   = useState<QuizMode>('typing')

  const { current, dataset, input, state, session, setInput, submit, submitSelection, next } =
    useQuiz(user?.id, script, mode)

  const { stats, refresh: refreshStats } = useStats()
  const { hearts, maxHearts, loseHeart, resetHearts, hasLives } = useHearts()

  const prevCorrectRef   = useRef(0)
  const prevStreakRef    = useRef(0)
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
    if (session.correct > prev) {
      setXpToastTrigger(t => t + 1)
    }
  }, [session.correct])

  useEffect(() => {
    if (state === 'incorrect') loseHeart()
  }, [state])

  // Refresh global stats whenever a session answer lands
  useEffect(() => {
    if (state === 'correct' || state === 'incorrect') {
      refreshStats()
    }
  }, [state, refreshStats])

  function handleRetry() {
    resetHearts()
    next()
  }

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <XPToast trigger={xpToastTrigger} />
      {!hasLives && (
        <SessionOverlay stats={session} onRetry={handleRetry} />
      )}
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col gap-5">

          {/* Header */}
          <header className="flex flex-col items-center gap-1">
            <img src={manaboLogo} alt="Manabo" className="h-12 w-auto object-contain" />
            <p className="text-sm text-purple-600 font-medium tracking-wide">Kana Practice</p>
          </header>

          {/* User badge + XP/streak + nav */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-gray-600 font-medium truncate max-w-[120px]">
                {user?.full_name ?? user?.applicant_id}
              </span>
              {stats && (
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5 tabular-nums">
                    ⚡ {stats.xp}
                  </span>
                  {stats.streak_days > 0 && (
                    <span className="text-xs font-bold text-amber-500 tabular-nums">
                      🔥 {stats.streak_days}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation('/dashboard')}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium
                  transition-colors touch-manipulation focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
              >
                Dashboard
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setLocation('/admin')}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium
                    transition-colors touch-manipulation focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
                >
                  Admin
                </button>
              )}
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors
                  touch-manipulation focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-purple-400 rounded"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Script selector */}
          <div role="group" aria-label="Script selection" className="flex gap-2">
            {SCRIPT_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setScript(o.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                  ${script === o.value
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-purple-100 hover:border-purple-300'
                  }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* Mode selector */}
          <div role="group" aria-label="Mode selection" className="flex gap-2">
            {MODE_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setMode(o.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                  ${mode === o.value
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-pink-100 hover:border-pink-300'
                  }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* Hearts */}
          <div className="flex justify-center">
            <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
          </div>

          {/* Main quiz area */}
          <main className="flex flex-col gap-5">
            <ScoreTracker session={session} />

            <div className="flex justify-center">
              <CharacterCard char={current} />
            </div>

            {mode === 'typing' ? (
              <InputField
                value={input}
                state={state}
                onChange={setInput}
                onSubmit={submit}
              />
            ) : (
              <MultipleChoiceOptions
                correct={current}
                dataset={dataset}
                state={state}
                onSelect={submitSelection}
              />
            )}

            <FeedbackDisplay state={state} char={current} />

            {mode === 'typing' && (
              <NextButton state={state} onNext={next} onSubmit={submit} />
            )}

            {mode === 'multiple-choice' && state !== 'answering' && (
              <NextButton state={state} onNext={next} onSubmit={() => {}} />
            )}
          </main>

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
      <Route path="/admin" component={AdminPage} />
      <Route component={QuizPage} />
    </Switch>
  )
}
