import type { HiraganaChar } from '../data/hiragana'

interface CharacterCardProps {
  char: HiraganaChar
}

export function CharacterCard({ char }: CharacterCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-purple-400 tracking-widest uppercase">
        What is this character?
      </p>
      <div className="flex items-center justify-center w-40 h-40 rounded-3xl bg-white shadow-lg">
        <span
          className="font-kana text-8xl leading-none select-none"
          aria-label={`Hiragana character: ${char.romaji}`}
        >
          {char.char}
        </span>
      </div>
    </div>
  )
}
