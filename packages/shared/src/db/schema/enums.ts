import { pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum      = pgEnum('user_role',      ['learner', 'admin'])
export const scriptTypeEnum    = pgEnum('script_type',    ['hiragana', 'katakana'])
export const practiceModeEnum  = pgEnum('practice_mode',  ['typing', 'multiple_choice', 'mixed'])
export const scriptFilterEnum  = pgEnum('script_filter',  ['hiragana', 'katakana', 'both'])
export const attemptStatusEnum = pgEnum('attempt_status', ['in_progress', 'submitted', 'abandoned', 'timed_out'])
