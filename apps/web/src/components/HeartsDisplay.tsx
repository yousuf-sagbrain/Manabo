interface HeartsDisplayProps {
  hearts: number
  maxHearts: number
}

export function HeartsDisplay({ hearts, maxHearts }: HeartsDisplayProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${hearts} of ${maxHearts} hearts remaining`}>
      {Array.from({ length: maxHearts }, (_, i) => (
        <span
          key={i}
          className={`text-lg leading-none transition-all duration-200 ${
            i < hearts ? 'opacity-100 scale-100' : 'opacity-25 grayscale scale-90'
          }`}
          aria-hidden="true"
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
