import { pgTable, uuid, integer, numeric, boolean, timestamp, index, unique } from 'drizzle-orm/pg-core'
import { users } from './users'
import { kanaCharacters } from './kanaCharacters'

export const userProgress = pgTable('user_progress', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').notNull().references(() => users.id),
  kanaId:         uuid('kana_id').notNull().references(() => kanaCharacters.id),
  correctCount:   integer('correct_count').notNull().default(0),
  incorrectCount: integer('incorrect_count').notNull().default(0),
  accuracy:       numeric('accuracy', { precision: 5, scale: 2 }).notNull().default('0'),
  isMastered:     boolean('is_mastered').notNull().default(false),
  lastSeenAt:     timestamp('last_seen_at', { withTimezone: true }),
  updatedAt:      timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique('user_progress_user_kana_unique').on(t.userId, t.kanaId),
  index('user_progress_user_id_idx').on(t.userId),
  index('user_progress_is_mastered_idx').on(t.isMastered),
])
