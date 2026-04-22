import { useEffect, useRef } from 'react'
import type { QuizState } from '../hooks/useQuiz'

interface InputFieldProps {
  value: string
  state: QuizState
  onChange: (value: string) => void
  onSubmit: () => void
}

export function InputField({ value, state, onChange, onSubmit }: InputFieldProps) {
  const ref = useRef<HTMLInputElement>(null)
  const disabled = state !== 'answering'

  useEffect(() => {
    if (!disabled) ref.current?.focus()
  }, [disabled])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="romaji-input" className="text-sm font-medium text-gray-500">
        Type the romanisation
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
        className="w-full h-14 px-4 rounded-2xl border-2 border-purple-200 bg-white text-gray-800
          text-lg font-sans placeholder-gray-300 outline-none transition-colors duration-150
          focus:border-purple-400 disabled:bg-gray-50 disabled:text-gray-400
          disabled:border-gray-200 disabled:cursor-not-allowed"
      />
    </div>
  )
}
