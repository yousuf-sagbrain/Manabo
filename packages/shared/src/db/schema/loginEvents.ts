import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core'
import { users } from './users'

export const loginEvents = pgTable('login_events', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull().references(() => users.id),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  loggedAt:  timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('login_events_user_id_idx').on(t.userId),
  index('login_events_logged_at_idx').on(t.loggedAt),
])
