import heartSvg from '../assets/heart.svg'

interface HeartsDisplayProps {
  hearts:    number
  maxHearts: number
}

export function HeartsDisplay({ hearts, maxHearts }: HeartsDisplayProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${hearts} of ${maxHearts} hearts remaining`}>
      {Array.from({ length: maxHearts }, (_, i) => (
        <img
          key={i}
          src={heartSvg}
          alt=""
          aria-hidden="true"
          className={`w-5 h-5 transition-all duration-200 ${
            i < hearts ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-90'
          }`}
        />
      ))}
    </div>
  )
}
