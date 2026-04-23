export interface BadgeMeta {
  label: string
  icon:  string
  desc:  string
}

export const BADGE_META: Record<string, BadgeMeta> = {
  first_practice: { label: 'First Steps',      icon: '🌟', desc: 'Complete your first practice session' },
  first_10:       { label: 'First 10',          icon: '🏆', desc: 'Get 10 correct answers' },
  all_hiragana:   { label: 'Hiragana Master',   icon: '🎌', desc: 'Master all 46 hiragana characters' },
  all_katakana:   { label: 'Katakana Master',   icon: '⚔️',  desc: 'Master all 46 katakana characters' },
  all_kana:       { label: 'Kana Legend',       icon: '👑', desc: 'Master all 92 kana characters' },
  streak_3:       { label: '3-Day Streak',      icon: '🔥', desc: 'Practice 3 days in a row' },
  streak_7:       { label: 'Weekly Warrior',    icon: '⚡', desc: 'Practice 7 days in a row' },
  first_pass:     { label: 'Test Passer',       icon: '✅', desc: 'Pass your first formal test' },
  perfect_score:  { label: 'Perfect Score',     icon: '💯', desc: 'Score 100% on a test' },
}

export const ALL_BADGE_KEYS = Object.keys(BADGE_META)
