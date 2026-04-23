import type { KanaChar } from '../data/types'

interface CharacterCardProps {
  char: KanaChar
}

export function CharacterCard({ char }: CharacterCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-purple-600 tracking-widest uppercase">
        What is this character?
      </p>
      <div className="flex items-center justify-center w-40 h-40 rounded-3xl bg-white shadow-lg">
        <span
          key={char.char}
          className="font-kana text-8xl leading-none select-none animate-slide-up"
          aria-label={`Japanese character, read as: ${char.romaji}`}
        >
          {char.char}
        </span>
      </div>
    </div>
  )
}
