import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { userRoleEnum } from './enums'
import { cohorts } from './cohorts'

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  applicantId:  varchar('applicant_id', { length: 20 }).notNull().unique(),
  fullName:     varchar('full_name', { length: 200 }),
  email:        varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  role:         userRoleEnum('role').notNull().default('learner'),
  cohortId:     uuid('cohort_id').references(() => cohorts.id),
  isActive:     boolean('is_active').notNull().default(true),
  lastLoginAt:  timestamp('last_login_at', { withTimezone: true }),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt:    timestamp('deleted_at', { withTimezone: true }),
}, (t) => [
  index('users_applicant_id_idx').on(t.applicantId),
  index('users_cohort_id_idx').on(t.cohortId),
])
