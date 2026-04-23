import { useEffect, useState } from 'react'

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#a855f7', '#f97316', '#14b8a6']
const COUNT = 20

interface ConfettiProps {
  trigger: number
}

export function Confetti({ trigger }: ConfettiProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (trigger === 0) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 900)
    return () => clearTimeout(t)
  }, [trigger])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
    >
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * 360
        const rad   = (angle * Math.PI) / 180
        const dist  = 60 + (i % 4) * 22
        const tx    = Math.cos(rad) * dist
        const ty    = Math.sin(rad) * dist - 20
        const size  = 5 + (i % 3) * 3
        const delay = i * 18

        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              width:  size,
              height: size,
              background:  COLORS[i % COLORS.length],
              top:  '50%',
              left: '50%',
              animation: `confettiFly 0.75s ease-out ${delay}ms forwards`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}
