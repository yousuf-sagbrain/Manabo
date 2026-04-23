import { useEffect, useRef } from 'react'
import type { QuizState } from '../hooks/useQuiz'

interface InputFieldProps {
  value:    string
  state:    QuizState
  onChange: (value: string) => void
  onSubmit: () => void
}

export function InputField({ value, state, onChange, onSubmit }: InputFieldProps) {
  const ref      = useRef<HTMLInputElement>(null)
  const disabled = state !== 'answering'

  useEffect(() => {
    if (!disabled) ref.current?.focus()
  }, [disabled])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor="romaji-input" className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
        Type the reading
      </label>
      <input
        id="romaji-input"
        ref={ref}
        type="text"
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. ka"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label="Romanisation input"
        className="
          w-full min-h-[44px] h-14 px-4 rounded-xl border-2
          bg-white text-navy-800 font-mono text-xl font-bold tracking-wider
          placeholder-slate-300 outline-none touch-manipulation
          transition-colors duration-[120ms]
          focus:border-amber-400
          disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed
        "
        style={{ borderColor: disabled ? '#e2e8f0' : '#dde3ee' }}
      />
    </div>
  )
}
