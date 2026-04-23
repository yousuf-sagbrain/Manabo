import { useState } from 'react'
import manaboLogo from '../assets/manabo_logo.png'
import heroSvg    from '../assets/hero.svg'

interface LoginScreenProps {
  onLogin: (applicantId: string, name?: string) => void
  loading: boolean
  error: string | null
}

export function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [applicantId, setApplicantId] = useState('')
  const [name, setName]               = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = applicantId.trim().toUpperCase()
    if (id) onLogin(id, name.trim() || undefined)
  }

  const inputBase =
    'w-full min-h-[44px] h-14 px-4 rounded-xl border-2 bg-white text-navy-800 outline-none ' +
    'font-mono text-base tracking-wider placeholder-slate-400 ' +
    'transition-colors duration-[120ms] touch-manipulation ' +
    'focus:border-amber-400 disabled:bg-slate-50 disabled:cursor-not-allowed'

  return (
    <div className="min-h-screen bg-[#fafbfd] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm flex flex-col gap-7">

        <header className="flex flex-col items-center gap-4">
          <img src={heroSvg} alt="" className="w-32 h-32 object-contain" aria-hidden="true" />
          <img src={manaboLogo} alt="Manabo" className="h-10 w-auto object-contain" />
          <p className="text-navy-500 text-sm font-semibold text-center">
            Enter your applicant ID to start learning.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="applicant-id" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
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
              style={{ borderColor: applicantId ? '#dde3ee' : '#dde3ee' }}
              className={inputBase}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="full-name" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              Full name <span className="text-slate-400 font-normal normal-case tracking-normal">(first visit only)</span>
            </label>
            <input
              id="full-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              disabled={loading}
              className={inputBase.replace('font-mono', 'font-sans')}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-500 text-center font-semibold">
              Oops — {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !applicantId.trim()}
            className="btn-primary mt-1"
          >
            {loading ? 'Signing in…' : 'Start learning'}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Pre-registered by the B-JET office. No password needed.
        </p>
      </div>
    </div>
  )
}
