# Mini Task Roadmap
> Task prefix: `M-` · Updated via `COMMIT_SKILL.md` workflow on every commit.

---

## Phase 0 — Core Requirements (Must-have)

| Status | Task ID | Domain | Priority | Notes |
|---|---|---|---|---|
| ✅ | M-000 | Vite + React 18 + TypeScript Scaffold | MUST | Scaffolded manually; Vite 5.4, React 18.3, TS 5.6 |
| ✅ | M-001 | Hiragana Dataset (46 characters) | MUST | `hiragana.ts` — all 46 gojūon with aliases (shi/si, chi/ti, tsu/tu, fu/hu) |
| ✅ | M-002 | Random Character Display | MUST | `useQuiz.ts` — `pickRandom()` with no-repeat consecutive guard |
| ✅ | M-003 | Romaji Input Field | MUST | `InputField.tsx` — autofocus, Enter-to-submit, trim + lowercase normalisation |
| ✅ | M-004 | Correct / Incorrect Feedback | MUST | `FeedbackDisplay.tsx` — colour + text, shows correct answer on wrong |
| ✅ | M-005 | Next Button | MUST | `NextButton.tsx` — disabled until answer submitted |

---

## Phase 1 — Standout Polish (Differentiators)

| Status | Task ID | Domain | Priority | Notes |
|---|---|---|---|---|
| ✅ | M-006 | Tailwind CSS Styling | MUST | Tailwind v3 configured; warm purple/pink palette |
| ✅ | M-007 | Session Score Tracker | MUST | `ScoreTracker.tsx` — correct / incorrect / accuracy % / streak + streakMax |
| ⏳ | M-008 | Audio Playback via Web Speech API | DEFERRABLE | `useAudio.ts` + `AudioButton.tsx` to build |
| ✅ | M-040 | XP Counter + Streak Flame in Quiz Header | MUST | XP pill + 🔥 streak in header; floating +10 XP toast on correct answer |
| ✅ | M-041 | Hearts/Lives System | DEFERRABLE | 5 hearts per session; SessionOverlay on 0 hearts; frontend-only |
| ✅ | M-044 | Leaderboard Modal | DEFERRABLE | Radix Dialog; podium top 3; ranked list; your row highlighted |
| ✅ | M-009 | Keyboard-First UX | MUST | Enter submits; Space/Enter advances to Next |
| ✅ | M-010 | Mobile-Responsive Layout | MUST | 44px touch targets; touch-manipulation on all controls; ScoreTracker grid at 320px; text-base on inputs (no iOS zoom) |
| ⏳ | M-011 | Dark / Light Mode Toggle | DEFERRABLE | `prefers-color-scheme` + manual override |
| ✅ | M-012 | A11y Pass (ARIA + Contrast + Focus Ring) | MUST | Single aria-live container; AA contrast (purple-600, gray-600); main landmark; role=group on ScoreTracker |
| ✅ | M-013 | Mode Toggle: Typing ⇌ Multiple Choice | DEFERRABLE | MultipleChoiceOptions.tsx; mode chip selector in App.tsx; submitSelection() in useQuiz |
| ✅ | M-014 | Subtle Micro-Interactions | DEFERRABLE | slide-up on char change; pop on correct; shake on incorrect; confetti burst at streak 5/10/20/30 |

---

## Phase 1B — Database & Full-Stack Integration

| Status | Task ID | Domain | Priority | Notes |
|---|---|---|---|---|
| ✅ | M-025 | Database Schema v2 (11-table model) | MUST | Drizzle ORM; cohorts, users, kana_characters, practice_sessions, practice_answers, test_attempts, test_answers, user_progress, achievements, study_time_logs, login_events |
| ✅ | M-026 | Neon PostgreSQL Connection + Kana Seed | MUST | asyncpg pool; 92 kana characters auto-seeded on startup |
| ✅ | M-027 | Auth System — ID-only Login (Phase 1) | MUST | JWT via python-jose; auto-create user on first login; login_events logged |
| ✅ | M-028 | Practice Session API | MUST | POST /sessions, POST /sessions/:id/answers, PATCH /sessions/:id/complete; user_progress upserted per answer |
| ✅ | M-029 | Test Attempt API | MUST | POST /attempts (20 random kana); POST /attempts/:id/submit; 80% pass threshold |
| ✅ | M-030 | Admin Dashboard API | MUST | GET /admin/dashboard — learner count, logins today, pass rate, avg study time |
| ✅ | M-047 | Super Admin Role Guard + /admin Route | MUST | Admin nav link (role-gated); /admin route in App.tsx |
| ✅ | M-048 | Audit Backend — Logins / Sessions / Tests | MUST | GET /admin/audit/logins|sessions|tests; paginated |
| ✅ | M-049 | Audit Page Frontend /admin | MUST | AdminPage.tsx; Radix Tabs; dashboard cards; Excel import/export |
| ✅ | M-050 | Excel Export — GET /admin/users/export | MUST | openpyxl; styled .xlsx with user stats |
| ✅ | M-051 | Excel Import — POST /admin/users/import | MUST | Upload .xlsx; validate; bulk INSERT ON CONFLICT DO NOTHING |
| ✅ | M-031 | Frontend Auth — Login Screen + useAuth | MUST | LoginScreen.tsx; JWT stored in localStorage; sign-out |
| ✅ | M-032 | Frontend API Client + useQuiz Integration | MUST | api.ts typed fetch client; useQuiz creates/records/completes sessions against DB |
| ✅ | M-033 | Vite Dev Proxy — Gateway-Free Development | MUST | Vite proxies /api → :8000; only 2 services needed in dev |

---

## Phase 2 — Deployment & Submission Package

| Status | Task ID | Domain | Priority | Notes |
|---|---|---|---|---|
| ⏳ | M-015 | Vercel Deployment | MUST | Deploy `apps/web` to Vercel; set memorable slug |
| ✅ | M-016 | Public GitHub Repo with Clean History | MUST | `github.com/yousuf-sagbrain/Manabo` — main / develop / release |
| ⏳ | M-017 | Excellent README | MUST | Screenshots + run instructions + Lighthouse scores + spec mapping |
| ⏳ | M-018 | LICENSE + package.json Metadata | DEFERRABLE | MIT licence; author + description in package.json |
| ⏳ | M-019 | Lighthouse Pass (Perf / A11y ≥ 95) | MUST | Run after Vercel deploy |
| ⏳ | M-020 | Application Message Submitted | MUST | GitHub + live URL + repo URL + experience note |

---

## Phase 3 — Post-Submission / Interview Prep (Optional)

| Status | Task ID | Domain | Priority | Notes |
|---|---|---|---|---|
| ⏳ | M-021 | Design Doc / Architecture Sketch | DEFERRABLE | 1–2 page doc on how the full project would be built |
| ⏳ | M-022 | "Why This Stack Fits" Note | DEFERRABLE | FastAPI + Express gateway, Neon + Drizzle rationale |
| ✅ | M-023 | Katakana Mode Extension | DEFERRABLE | useQuiz accepts script param; Hiragana/Katakana/Mixed chip selector in App.tsx |
| ⏳ | M-024 | Admin Dashboard Mockup | DEFERRABLE | Static React page mocking Spec §8 dashboard |

---

## Status Legend

| Emoji | Meaning |
|---|---|
| ⏳ | Not Started |
| 🏃 | In-Progress |
| ✅ | Completed |
| ⛔️ | Blocked |

---

## Version History

| Date | Task ID | Title | Status |
|---|---|---|---|
| 2026-04-22 | M-000 | Vite + React 18 + TypeScript Scaffold | Completed |
| 2026-04-22 | M-001 | Hiragana Dataset (46 characters) | Completed |
| 2026-04-22 | M-002 | Random Character Display | Completed |
| 2026-04-22 | M-003 | Romaji Input Field | Completed |
| 2026-04-22 | M-004 | Correct / Incorrect Feedback | Completed |
| 2026-04-22 | M-005 | Next Button | Completed |
| 2026-04-22 | M-006 | Tailwind CSS Styling | Completed |
| 2026-04-22 | M-007 | Session Score Tracker | Completed |
| 2026-04-22 | M-009 | Keyboard-First UX | Completed |
| 2026-04-22 | M-016 | Public GitHub Repo with Clean History | Completed |
| 2026-04-22 | M-025 | Database Schema v2 (11-table model) | Completed |
| 2026-04-22 | M-026 | Neon PostgreSQL Connection + Kana Seed | Completed |
| 2026-04-22 | M-027 | Auth System — ID-only Login (Phase 1) | Completed |
| 2026-04-22 | M-028 | Practice Session API | Completed |
| 2026-04-22 | M-029 | Test Attempt API | Completed |
| 2026-04-22 | M-030 | Admin Dashboard API | Completed |
| 2026-04-22 | M-031 | Frontend Auth — Login Screen + useAuth | Completed |
| 2026-04-22 | M-032 | Frontend API Client + useQuiz Integration | Completed |
| 2026-04-22 | M-033 | Vite Dev Proxy — Gateway-Free Development | Completed |
| 2026-04-22 | M-014 | Subtle Micro-Interactions | Completed |
| 2026-04-22 | M-010 | Mobile-Responsive Layout | Completed |
| 2026-04-22 | M-012 | A11y Pass (ARIA + Contrast + Focus Ring) | Completed |
| 2026-04-23 | M-034 | Schema Migration — xp + streak_days + last_practice_date on users | Completed |
| 2026-04-23 | M-037 | XP Awarding — practice + test flows | Completed |
| 2026-04-23 | M-038 | Badge Awarding — 9 badges, auto-award logic | Completed |
| 2026-04-23 | M-035 | Stats API — GET /users/me/stats | Completed |
| 2026-04-23 | M-036 | Leaderboard API — GET /leaderboard | Completed |
| 2026-04-23 | M-023 | Katakana Mode Extension | Completed |
| 2026-04-23 | M-013 | Mode Toggle: Typing ⇌ Multiple Choice | Completed |
| 2026-04-23 | M-039 | Dashboard Page — /dashboard | Completed |
| 2026-04-23 | M-040 | XP Counter + Streak Flame in Quiz Header | Completed |
| 2026-04-23 | M-041 | Hearts/Lives System | Completed |
| 2026-04-23 | M-044 | Leaderboard Modal | Completed |
| 2026-04-23 | M-047 | Super Admin Role Guard + /admin Route | Completed |
| 2026-04-23 | M-048 | Audit Backend — Logins / Sessions / Tests | Completed |
| 2026-04-23 | M-049 | Audit Page Frontend | Completed |
| 2026-04-23 | M-050 | Excel Export | Completed |
| 2026-04-23 | M-051 | Excel Import | Completed |
