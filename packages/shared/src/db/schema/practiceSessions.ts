import { pgTable, uuid, integer, numeric, timestamp, index } from 'drizzle-orm/pg-core'
import { practiceModeEnum, scriptFilterEnum } from './enums'
import { users } from './users'

export const practiceSessions = pgTable('practice_sessions', {
  id:              uuid('id').primaryKey().defaultRandom(),
  userId:          uuid('user_id').notNull().references(() => users.id),
  mode:            practiceModeEnum('mode').notNull().default('typing'),
  scriptFilter:    scriptFilterEnum('script_filter').notNull().default('hiragana'),
  totalQuestions:  integer('total_questions').notNull().default(0),
  correctCount:    integer('correct_count').notNull().default(0),
  incorrectCount:  integer('incorrect_count').notNull().default(0),
  accuracy:        numeric('accuracy', { precision: 5, scale: 2 }).notNull().default('0'),
  streakMax:       integer('streak_max').notNull().default(0),
  durationSeconds: integer('duration_seconds'),
  completedAt:     timestamp('completed_at', { withTimezone: true }),
  createdAt:       timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('practice_sessions_user_id_idx').on(t.userId),
  index('practice_sessions_created_at_idx').on(t.createdAt),
])
