import { useState, useEffect } from 'react'

interface XPToastProps {
  trigger: number
  amount?: number
}

interface ToastItem {
  id: number
  amount: number
}

export function XPToast({ trigger, amount = 10 }: XPToastProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    if (trigger === 0) return
    const id = Date.now()
    setToasts(prev => [...prev, { id, amount }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 900)
  }, [trigger])

  return (
    <div className="fixed bottom-24 right-4 pointer-events-none z-50 flex flex-col items-end gap-1">
      {toasts.map(t => (
        <span
          key={t.id}
          className="animate-float-up text-sm font-extrabold text-amber-500 drop-shadow-sm select-none"
        >
          +{t.amount} XP
        </span>
      ))}
    </div>
  )
}
