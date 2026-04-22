import { pgTable, uuid, varchar, integer, date, timestamp, index } from 'drizzle-orm/pg-core'
import { users } from './users'

export const studyTimeLogs = pgTable('study_time_logs', {
  id:              uuid('id').primaryKey().defaultRandom(),
  userId:          uuid('user_id').notNull().references(() => users.id),
  page:            varchar('page', { length: 50 }).notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  sessionDate:     date('session_date').notNull(),
  loggedAt:        timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('study_time_logs_user_id_idx').on(t.userId),
  index('study_time_logs_session_date_idx').on(t.sessionDate),
])
