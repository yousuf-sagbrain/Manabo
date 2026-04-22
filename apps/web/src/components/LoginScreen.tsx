import { useState } from 'react'
import manaboLogo from '../assets/manabo_logo.png'

interface LoginScreenProps {
  onLogin: (applicantId: string, name?: string) => void
  loading: boolean
  error: string | null
}

export function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [applicantId, setApplicantId] = useState('')
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = applicantId.trim().toUpperCase()
    if (id) onLogin(id, name.trim() || undefined)
  }

  const inputClass =
    'w-full h-14 px-4 rounded-2xl border-2 border-purple-200 bg-white text-gray-800 ' +
    'text-lg font-sans placeholder-gray-300 outline-none transition-colors duration-150 ' +
    'focus:border-purple-400 disabled:bg-gray-50 disabled:cursor-not-allowed'

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <header className="flex flex-col items-center gap-1">
          <img src={manaboLogo} alt="Manabo" className="h-12 w-auto object-contain" />
          <p className="text-sm text-purple-400 font-medium tracking-wide">Sign in to start learning</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <label htmlFor="applicant-id" className="text-sm font-medium text-gray-500">
              Applicant ID
            </label>
            <input
              id="applicant-id"
              type="text"
              value={applicantId}
              onChange={e => setApplicantId(e.target.value)}
              placeholder="BJET-2025-0001"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="full-name" className="text-sm font-medium text-gray-500">
              Full name <span className="text-gray-400 font-normal">(first visit only)</span>
            </label>
            <input
              id="full-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !applicantId.trim()}
            className="w-full h-14 rounded-2xl bg-purple-500 text-white font-semibold text-lg
              active:scale-95 transition-transform duration-150 shadow-md
              hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed
              disabled:active:scale-100"
          >
            {loading ? 'Signing in…' : 'Start Learning →'}
          </button>

        </form>
      </div>
    </div>
  )
}
