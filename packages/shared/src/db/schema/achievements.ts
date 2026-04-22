import { pgTable, uuid, varchar, timestamp, index, unique } from 'drizzle-orm/pg-core'
import { users } from './users'

export const achievements = pgTable('achievements', {
  id:       uuid('id').primaryKey().defaultRandom(),
  userId:   uuid('user_id').notNull().references(() => users.id),
  badgeKey: varchar('badge_key', { length: 50 }).notNull(),
  earnedAt: timestamp('earned_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique('achievements_user_badge_unique').on(t.userId, t.badgeKey),
  index('achievements_user_id_idx').on(t.userId),
])

// Badge keys: first_10 | all_hiragana | all_katakana | all_kana | streak_3 | streak_7 | first_pass | perfect_score
