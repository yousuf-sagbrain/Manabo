import { useQuiz } from './hooks/useQuiz'
import { CharacterCard } from './components/CharacterCard'
import { InputField } from './components/InputField'
import { FeedbackDisplay } from './components/FeedbackDisplay'
import { ScoreTracker } from './components/ScoreTracker'
import { NextButton } from './components/NextButton'

export default function App() {
  const { current, input, state, session, setInput, submit, next } = useQuiz()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-2xl font-bold text-purple-800 font-kana">学ぼ</h1>
          <p className="text-sm text-purple-400 font-medium tracking-wide">Manabo · Hiragana Practice</p>
        </header>

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
