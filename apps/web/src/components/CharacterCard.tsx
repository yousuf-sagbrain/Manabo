import type { KanaChar } from '../data/types'

interface CharacterCardProps {
  char: KanaChar
}

export function CharacterCard({ char }: CharacterCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-xs font-extrabold text-slate-400 tracking-widest uppercase">
        What's the reading?
      </p>
      <div
        className="flex items-center justify-center w-full py-10 rounded-2xl
                   bg-white border-2 border-slate-200"
        style={{ borderBottomWidth: 4, borderBottomColor: '#dde3ee' }}
      >
        <span
          key={char.char}
          className="font-kana font-bold leading-none select-none animate-pop text-navy-800"
          style={{ fontSize: 160 }}
          aria-label={`Japanese character, read as: ${char.romaji}`}
        >
          {char.char}
        </span>
      </div>
    </div>
  )
}
