import { useMemo } from 'react'
import type { KanaChar }  from '../data/types'
import type { QuizState } from '../hooks/useQuiz'

interface MultipleChoiceOptionsProps {
  correct:  KanaChar
  dataset:  KanaChar[]
  state:    QuizState
  onSelect: (romaji: string) => void
}

const KEYS = ['A', 'B', 'C', 'D']

export function MultipleChoiceOptions({ correct, dataset, state, onSelect }: MultipleChoiceOptionsProps) {
  const options = useMemo(() => {
    const distractors = dataset
      .filter(k => k.romaji !== correct.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    return [...distractors, correct].sort(() => Math.random() - 0.5)
  }, [correct.char]) // eslint-disable-line react-hooks/exhaustive-deps

  const answered = state !== 'answering'

  return (
    <div className="flex flex-col gap-2.5 w-full" role="group" aria-label="Answer choices">
      {options.map((opt, i) => {
        const isCorrectOpt = opt.romaji === correct.romaji

        let cls =
          'flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-xl ' +
          'border-2 bg-white text-navy-800 font-bold text-base cursor-pointer ' +
          'transition-all duration-[120ms] touch-manipulation ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ' +
          'disabled:cursor-not-allowed'

        let borderStyle = { borderColor: '#dde3ee', borderBottomWidth: 4, borderBottomColor: '#c3cbdc' } as React.CSSProperties

        if (answered) {
          if (isCorrectOpt) {
            cls += ' bg-green-100 text-green-700'
            borderStyle = { borderColor: '#22c55e', borderBottomWidth: 4, borderBottomColor: '#16a34a' }
          } else {
            cls += ' bg-slate-50 text-slate-400'
            borderStyle = { borderColor: '#dde3ee', borderBottomWidth: 4, borderBottomColor: '#c3cbdc' }
          }
        } else {
          cls += ' hover:border-amber-300 hover:bg-amber-50 active:translate-y-[1px]'
        }

        return (
          <button
            key={opt.romaji}
            type="button"
            disabled={answered}
            onClick={() => onSelect(opt.romaji)}
            aria-label={`Answer: ${opt.romaji}`}
            className={cls}
            style={answered ? borderStyle : borderStyle}
          >
            <span
              className="inline-grid place-items-center w-7 h-7 shrink-0 rounded-lg border-2 text-xs font-extrabold text-slate-400"
              style={{ borderColor: '#dde3ee' }}
            >
              {KEYS[i]}
            </span>
            <span className="font-mono font-extrabold text-lg">{opt.romaji}</span>
          </button>
        )
      })}
    </div>
  )
}
