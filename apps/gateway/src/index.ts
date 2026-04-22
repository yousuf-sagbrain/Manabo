import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { rateLimiter, examRateLimiter } from './middleware/rateLimiter'

const app = express()
const PORT = process.env.PORT ?? 4000
const API_URL = process.env.API_URL ?? 'http://localhost:8000'

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' }))
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'manabo-gateway' })
})

// Stricter rate limit on exam endpoints to protect July test load
app.use('/api/test', examRateLimiter)
app.use('/api', rateLimiter)

// Proxy all /api requests to FastAPI
app.use(
  '/api',
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  }),
)

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`)
})
