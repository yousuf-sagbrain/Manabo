import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please slow down.' },
})

// Tighter limit for exam endpoints — prevents scripted answer submission
export const examRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down — exam submissions are rate limited.' },
})
