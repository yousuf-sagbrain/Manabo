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
| ✅ | M-007 | Session Score Tracker | MUST | `ScoreTracker.tsx` — correct / incorrect / accuracy % / streak |
| ⏳ | M-008 | Audio Playback via Web Speech API | DEFERRABLE | `useAudio.ts` + `AudioButton.tsx` to build |
| ✅ | M-009 | Keyboard-First UX | MUST | Enter submits; Space/Enter advances to Next |
| ⏳ | M-010 | Mobile-Responsive Layout | MUST | 44px touch targets spec-compliant; needs full mobile QA |
| ⏳ | M-011 | Dark / Light Mode Toggle | DEFERRABLE | `prefers-color-scheme` + manual override |
| ⏳ | M-012 | A11y Pass (ARIA + Contrast + Focus Ring) | MUST | `aria-live` on feedback; AA contrast check pending |
| ⏳ | M-013 | Mode Toggle: Typing ⇌ Multiple Choice | DEFERRABLE | `MultipleChoice.tsx` to build |
| ⏳ | M-014 | Subtle Micro-Interactions | DEFERRABLE | Fade on character change; pulse on correct/incorrect |

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
| ⏳ | M-023 | Katakana Mode Extension | DEFERRABLE | Branch demo; `katakana.ts` already exists |
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
