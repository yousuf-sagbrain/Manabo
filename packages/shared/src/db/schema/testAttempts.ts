import { pgTable, uuid, integer, numeric, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { attemptStatusEnum } from './enums'
import { users } from './users'

export const testAttempts = pgTable('test_attempts', {
  id:               uuid('id').primaryKey().defaultRandom(),
  userId:           uuid('user_id').notNull().references(() => users.id),
  score:            integer('score').notNull().default(0),
  totalQuestions:   integer('total_questions').notNull().default(20),
  accuracy:         numeric('accuracy', { precision: 5, scale: 2 }).notNull().default('0'),
  passed:           boolean('passed').notNull().default(false),
  timeTakenSeconds: integer('time_taken_seconds'),
  startedAt:        timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  submittedAt:      timestamp('submitted_at', { withTimezone: true }),
  status:           attemptStatusEnum('status').notNull().default('in_progress'),
  attemptNumber:    integer('attempt_number').notNull().default(1),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('test_attempts_user_id_idx').on(t.userId),
  index('test_attempts_status_idx').on(t.status),
  index('test_attempts_created_at_idx').on(t.createdAt),
])
