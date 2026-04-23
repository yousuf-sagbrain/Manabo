import { useMemo } from 'react'
import type { KanaChar } from '../data/types'
import type { QuizState } from '../hooks/useQuiz'

interface MultipleChoiceOptionsProps {
  correct:    KanaChar
  dataset:    KanaChar[]
  state:      QuizState
  onSelect:   (romaji: string) => void
}

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
    <div className="grid grid-cols-2 gap-3 w-full" role="group" aria-label="Answer choices">
      {options.map(opt => {
        const isCorrectOpt = opt.romaji === correct.romaji
        const selected     = answered

        let style = 'bg-white border-2 border-purple-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
        if (answered) {
          if (isCorrectOpt)      style = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700'
          else if (!isCorrectOpt) style = 'bg-gray-50 border-2 border-gray-200 text-gray-400'
        }

        return (
          <button
            key={opt.romaji}
            type="button"
            disabled={answered}
            onClick={() => onSelect(opt.romaji)}
            aria-label={`Answer: ${opt.romaji}`}
            className={`min-h-[56px] rounded-2xl font-semibold text-lg
              transition-all duration-150 active:scale-95 touch-manipulation
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300
              disabled:cursor-not-allowed disabled:active:scale-100 ${style}`}
          >
            {opt.romaji}
          </button>
        )
      })}
    </div>
  )
}
