import { pgTable, uuid, varchar, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core'
import { practiceSessions } from './practiceSessions'
import { users } from './users'
import { kanaCharacters } from './kanaCharacters'

export const practiceAnswers = pgTable('practice_answers', {
  id:         uuid('id').primaryKey().defaultRandom(),
  sessionId:  uuid('session_id').notNull().references(() => practiceSessions.id),
  userId:     uuid('user_id').notNull().references(() => users.id),
  kanaId:     uuid('kana_id').notNull().references(() => kanaCharacters.id),
  userInput:  varchar('user_input', { length: 20 }).notNull(),
  isCorrect:  boolean('is_correct').notNull(),
  responseMs: integer('response_ms'),
  answeredAt: timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('practice_answers_session_id_idx').on(t.sessionId),
  index('practice_answers_user_id_idx').on(t.userId),
  index('practice_answers_kana_id_idx').on(t.kanaId),
])
