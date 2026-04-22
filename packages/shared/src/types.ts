// Shared TypeScript types consumed by both apps/web and apps/gateway

export interface KanaChar {
  char: string
  romaji: string
  aliases: string[]
}

export type Script = 'hiragana' | 'katakana' | 'mixed'

export type BadgeType =
  | 'first_10'
  | 'all_hiragana'
  | 'all_katakana'
  | 'seven_day_streak'

export interface QuizAnswer {
  char: string
  input: string
  correct: boolean
  timeTakenMs: number
}

export interface SessionSummary {
  correct: number
  incorrect: number
  streak: number
  accuracy: number
  durationSec: number
}
