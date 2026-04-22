import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const scriptEnum = pgEnum('script', ['hiragana', 'katakana', 'mixed'])
export const badgeEnum  = pgEnum('badge_type', [
  'first_10',
  'all_hiragana',
  'all_katakana',
  'seven_day_streak',
])

// ─── Cohorts ──────────────────────────────────────────────────────────────────

export const cohorts = pgTable('cohorts', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),           // e.g. "Batch 16"
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id:          uuid('id').primaryKey().defaultRandom(),
  applicantId: text('applicant_id').notNull().unique(), // BJET-YYYY-XXXX
  name:        text('name').notNull(),
  cohortId:    uuid('cohort_id').notNull().references(() => cohorts.id),
  isAdmin:     boolean('is_admin').notNull().default(false),
  email:       text('email'),                  // null until Phase 3 migration
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
})

// ─── Practice Sessions ────────────────────────────────────────────────────────

export const practiceSessions = pgTable('practice_sessions', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id),
  script:      scriptEnum('script').notNull(),
  correct:     integer('correct').notNull().default(0),
  incorrect:   integer('incorrect').notNull().default(0),
  streak:      integer('streak').notNull().default(0),
  durationSec: integer('duration_sec').notNull().default(0),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

// ─── Test Attempts ────────────────────────────────────────────────────────────

export const testAttempts = pgTable('test_attempts', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id),
  score:       integer('score').notNull(),      // 0–20
  passed:      boolean('passed').notNull(),     // score >= 16; visible to admins only
  timeTakenSec: integer('time_taken_sec').notNull(),
  startedAt:   timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
})

// ─── User Badges ──────────────────────────────────────────────────────────────

export const userBadges = pgTable('user_badges', {
  id:       uuid('id').primaryKey().defaultRandom(),
  userId:   uuid('user_id').notNull().references(() => users.id),
  badge:    badgeEnum('badge').notNull(),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
})

// ─── Study Time Logs ──────────────────────────────────────────────────────────

export const studyTimeLogs = pgTable('study_time_logs', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id),
  page:        text('page').notNull(),          // e.g. "chart", "practice", "test"
  durationSec: integer('duration_sec').notNull(),
  loggedAt:    timestamp('logged_at').notNull().defaultNow(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const cohortsRelations = relations(cohorts, ({ many }) => ({
  users: many(users),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  cohort:           one(cohorts, { fields: [users.cohortId], references: [cohorts.id] }),
  practiceSessions: many(practiceSessions),
  testAttempts:     many(testAttempts),
  badges:           many(userBadges),
  studyTimeLogs:    many(studyTimeLogs),
}))
