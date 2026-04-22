import manaboLogo from './assets/manabo_logo.png'
import { useQuiz } from './hooks/useQuiz'
import { useAuth } from './hooks/useAuth'
import { CharacterCard } from './components/CharacterCard'
import { InputField } from './components/InputField'
import { FeedbackDisplay } from './components/FeedbackDisplay'
import { ScoreTracker } from './components/ScoreTracker'
import { NextButton } from './components/NextButton'
import { LoginScreen } from './components/LoginScreen'

export default function App() {
  const { user, login, logout, loading, error } = useAuth()
  const { current, input, state, session, setInput, submit, next } = useQuiz(user?.id)

  if (!user) {
    return <LoginScreen onLogin={login} loading={loading} error={error} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col items-center gap-1">
          <img
            src={manaboLogo}
            alt="Manabo"
            className="h-12 w-auto object-contain"
          />
          <p className="text-sm text-purple-400 font-medium tracking-wide">Hiragana Practice</p>
        </header>

        {/* User badge + logout */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-400 font-medium truncate max-w-[70%]">
            {user.full_name ?? user.applicant_id}
          </span>
          <button
            onClick={logout}
            className="text-xs text-purple-400 hover:text-purple-600 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Score */}
        <ScoreTracker session={session} />

        {/* Character */}
        <div className="flex justify-center">
          <CharacterCard char={current} />
        </div>

        {/* Input */}
        <InputField
          value={input}
          state={state}
          onChange={setInput}
          onSubmit={submit}
        />

        {/* Feedback */}
        <FeedbackDisplay state={state} char={current} />

        {/* Action button */}
        <NextButton state={state} onNext={next} onSubmit={submit} />

      </div>
    </div>
  )
}
