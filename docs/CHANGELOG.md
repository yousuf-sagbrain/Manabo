# Changelog
> Managed by `COMMIT_SKILL.md`. New entries are prepended at the top.

---

## [M-025..M-033] Full-stack database integration — 2026-04-22
- Status: Completed
- M-025: Drizzle ORM schema v2 — 11 tables (cohorts, users, kana_characters, practice_sessions, practice_answers, test_attempts, test_answers, user_progress, achievements, study_time_logs, login_events) + 5 enums pushed to Neon PostgreSQL
- M-026: asyncpg connection pool in FastAPI; 92 hiragana + katakana characters auto-seeded on first startup
- M-027: JWT auth (python-jose); ID-only Phase 1 login; auto-creates user on first login; logs login_events
- M-028: Practice session CRUD — POST /sessions, POST /sessions/:id/answers, PATCH /sessions/:id/complete; user_progress upserted per answer with accuracy + mastery tracking
- M-029: Test attempt API — 20 random kana served from DB; submit scores with 80% pass threshold
- M-030: Admin dashboard API — learner count, logins today, pass rate, avg study time (7d)
- M-031: LoginScreen.tsx + useAuth hook; JWT persisted in localStorage; sign-out
- M-032: Typed api.ts fetch client; useQuiz creates backend session on mount, records every answer fire-and-forget, completes session on unmount
- M-033: Vite dev server proxy — /api → :8000 direct; gateway not required for local dev; CORS updated

## [M-016] Set up public GitHub repo with branch strategy — 2026-04-22
- Status: Completed
- Notes: main / develop / release branches pushed to github.com/yousuf-sagbrain/Manabo

## [M-009] Keyboard-first UX — 2026-04-22
- Status: Completed
- Notes: Enter submits answer; Space/Enter advances to Next after feedback shown

## [M-007] Session score tracker — 2026-04-22
- Status: Completed
- Notes: ScoreTracker.tsx displays correct / incorrect / accuracy % / streak live per session

## [M-006] Tailwind CSS styling — 2026-04-22
- Status: Completed
- Notes: Tailwind v3 configured; warm purple/pink palette; Noto Sans JP + Inter via Google Fonts

## [M-005] Next button — 2026-04-22
- Status: Completed
- Notes: Disabled before answer submitted; transitions to Next after feedback shown

## [M-004] Correct / incorrect feedback — 2026-04-22
- Status: Completed
- Notes: FeedbackDisplay.tsx — colour + text together; shows correct romaji on wrong answer

## [M-003] Romaji input field — 2026-04-22
- Status: Completed
- Notes: Autofocus on mount/next; Enter-to-submit; trim + lowercase normalisation

## [M-002] Random character display — 2026-04-22
- Status: Completed
- Notes: pickRandom() excludes last shown character — no consecutive repeats

## [M-001] Hiragana dataset (46 characters) — 2026-04-22
- Status: Completed
- Notes: hiragana.ts — all 46 gojūon; aliases for shi/si, chi/ti, tsu/tu, fu/hu, wo/o, n/nn

## [M-000] Vite + React 18 + TypeScript scaffold — 2026-04-22
- Status: Completed
- Notes: Vite 5.4 + React 18.3 + TypeScript 5.6; monorepo inside Manabo/apps/web
