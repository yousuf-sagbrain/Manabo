import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { scriptTypeEnum } from './enums'

export const kanaCharacters = pgTable('kana_characters', {
  id:         uuid('id').primaryKey().defaultRandom(),
  character:  varchar('character', { length: 5 }).notNull(),
  romaji:     varchar('romaji', { length: 10 }).notNull(),
  aliases:    varchar('aliases', { length: 10 }).array().notNull().default(sql`'{}'::varchar[]`),
  scriptType: scriptTypeEnum('script_type').notNull(),
  vowelGroup: varchar('vowel_group', { length: 5 }).notNull(),
  rowOrder:   integer('row_order').notNull(),
  colOrder:   integer('col_order').notNull(),
  audioUrl:   varchar('audio_url', { length: 500 }),
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('kana_script_type_idx').on(t.scriptType),
  index('kana_vowel_group_idx').on(t.vowelGroup),
])
