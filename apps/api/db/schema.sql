-- Manabo — Full database schema
-- All statements use IF NOT EXISTS / ON CONFLICT so this file is safe to re-run.

-- ── Cohorts ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cohorts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id       TEXT NOT NULL UNIQUE,
  full_name          TEXT,
  role               TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
  cohort_id          UUID REFERENCES cohorts(id) ON DELETE SET NULL,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  xp                 INTEGER NOT NULL DEFAULT 0,
  streak_days        INTEGER NOT NULL DEFAULT 0,
  last_practice_date DATE,
  last_login_at      TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at         TIMESTAMPTZ
);

-- ── Kana Characters ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kana_characters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character   TEXT NOT NULL,
  romaji      TEXT NOT NULL,
  aliases     TEXT[] NOT NULL DEFAULT '{}',
  script_type TEXT NOT NULL CHECK (script_type IN ('hiragana', 'katakana')),
  vowel_group TEXT,
  row_order   INTEGER,
  col_order   INTEGER,
  UNIQUE (character, script_type)
);

-- ── Login Events ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- ── Practice Sessions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS practice_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  script_filter    TEXT NOT NULL CHECK (script_filter IN ('hiragana', 'katakana', 'both')),
  mode             TEXT NOT NULL DEFAULT 'typing',
  correct_count    INTEGER NOT NULL DEFAULT 0,
  incorrect_count  INTEGER NOT NULL DEFAULT 0,
  accuracy         NUMERIC(5,2),
  streak_max       INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

-- ── Practice Answers ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS practice_answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kana_id     UUID NOT NULL REFERENCES kana_characters(id),
  user_input  TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL,
  response_ms INTEGER,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── User Progress (per-character mastery) ─────────────────────────────────────
-- Mastered when: correct_count >= 5 AND accuracy >= 80
CREATE TABLE IF NOT EXISTS user_progress (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kana_id         UUID NOT NULL REFERENCES kana_characters(id),
  correct_count   INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  accuracy        NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_mastered     BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, kana_id)
);

-- ── Test Attempts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_number  INTEGER NOT NULL DEFAULT 1,
  score           INTEGER,
  total_questions INTEGER NOT NULL DEFAULT 20,
  accuracy        NUMERIC(5,2),
  passed          BOOLEAN,
  status          TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted')),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at    TIMESTAMPTZ
);

-- ── Test Answers ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_answers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id     UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kana_id        UUID NOT NULL REFERENCES kana_characters(id),
  question_order INTEGER NOT NULL,
  user_input     TEXT NOT NULL,
  is_correct     BOOLEAN NOT NULL,
  response_ms    INTEGER
);

-- ── Achievements (badges) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_key)
);

-- ── Study Time Logs ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_time_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page             TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  session_date     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_login_events_user        ON login_events(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_events_date        ON login_events(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user   ON practice_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_answers_session ON practice_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user       ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user       ON test_attempts(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user        ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_users_xp                 ON users(xp DESC);
CREATE INDEX IF NOT EXISTS idx_users_applicant          ON users(applicant_id);
