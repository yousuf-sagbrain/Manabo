import { pgTable, uuid, varchar, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core'
import { testAttempts } from './testAttempts'
import { users } from './users'
import { kanaCharacters } from './kanaCharacters'

export const testAnswers = pgTable('test_answers', {
  id:            uuid('id').primaryKey().defaultRandom(),
  attemptId:     uuid('attempt_id').notNull().references(() => testAttempts.id),
  userId:        uuid('user_id').notNull().references(() => users.id),
  kanaId:        uuid('kana_id').notNull().references(() => kanaCharacters.id),
  questionOrder: integer('question_order').notNull(),
  userInput:     varchar('user_input', { length: 20 }).notNull(),
  isCorrect:     boolean('is_correct').notNull(),
  responseMs:    integer('response_ms'),
  answeredAt:    timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('test_answers_attempt_id_idx').on(t.attemptId),
  index('test_answers_user_id_idx').on(t.userId),
  index('test_answers_kana_id_idx').on(t.kanaId),
])
