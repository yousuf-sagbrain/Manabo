import { useState, useCallback } from 'react'

const MAX_HEARTS = 5

export function useHearts() {
  const [hearts, setHearts] = useState(MAX_HEARTS)

  const loseHeart = useCallback(() => {
    setHearts(h => Math.max(0, h - 1))
  }, [])

  const resetHearts = useCallback(() => {
    setHearts(MAX_HEARTS)
  }, [])

  return { hearts, maxHearts: MAX_HEARTS, loseHeart, resetHearts, hasLives: hearts > 0 }
}
