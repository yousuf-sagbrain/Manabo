# Full Project Roadmap — B-JET Hiragana & Katakana Learning App
> Prefix: `P0-` / `P1-` / `P2-` / `P3-` / `P4-` · Updated via `COMMIT_SKILL.md` workflow.

---

## Phase 0 — Design System & Project Foundation

| Status | Task ID | Domain | Priority |
|---|---|---|---|
| ✅ | P0-001 | Color palette and visual tone | MUST |
| ⏳ | P0-002 | Radix UI + Tailwind component kit (Button, Card, Modal, Toast) | MUST |
| ⏳ | P0-003 | Typography — Noto Sans JP (kana) + Inter (Latin) | MUST |
| ✅ | P0-004 | Monorepo and workspace setup (apps/* + packages/*) | MUST |
| ✅ | P0-005 | Database schema — Drizzle + Neon (users, cohorts, practice, test) | MUST |
| ✅ | P0-006 | Express gateway to FastAPI proxy | MUST |
| ⏳ | P0-007 | CI/CD — GitHub Actions → Vercel + Render | MUST |
| ⏳ | P0-008 | i18next scaffold (EN / JP / BN) | MUST |

---

## Phase 1 — Core Learning Experience (Early-June 2026)

| Status | Task ID | Domain | Priority |
|---|---|---|---|
| ⏳ | P1-001 | Applicant ID login (BJET-YYYY-XXXX auto-format) | MUST |
| ⏳ | P1-002 | Friendly welcome screen | MUST |
| ⏳ | P1-003 | Learner home — 3 big cards (Learn / Practice / Test) | MUST |
| ⏳ | P1-004 | Pre-learning Gojuon charts (Hiragana + Katakana) | MUST |
| ⏳ | P1-005 | Audio playback (Web Speech API + MP3 fallback) | MUST |
| ⏳ | P1-006 | Vocabulary list with images | MUST |
| ⏳ | P1-007 | Self-check practice (typing + multiple choice) | MUST |
| ⏳ | P1-008 | Progress bar and daily streak | MUST |
| ⏳ | P1-009 | Achievement badges (First 10, All Hiragana, All Katakana, 7-day) | MUST |
| ⏳ | P1-010 | Study time tracking (page-level dwell time) | MUST |
| ⏳ | P1-011 | Mobile-first responsive UI (44px touch targets) | MUST |
| ⏳ | P1-012 | Accessibility pass (ARIA, AA contrast, keyboard nav) | MUST |
| ⏳ | P1-013 | Micro-interactions (bounce, confetti, fade — 150–300ms) | MUST |

---

## Phase 2 — Mastery Test & Admin Dashboard (End-June 2026)

| Status | Task ID | Domain | Priority |
|---|---|---|---|
| ⏳ | P2-001 | Test start screen (20Q / 10 min / 80% briefing) | MUST |
| ⏳ | P2-002 | Mastery test engine (random 20Q, server-authoritative timer) | MUST |
| ⏳ | P2-003 | Clean test-taking UI (nav hidden) | MUST |
| ⏳ | P2-004 | Result screen (confetti pass / encouraging fail) | MUST |
| ⏳ | P2-005 | Scoring and pass/fail logic (80% threshold, admin-only flag) | MUST |
| ⏳ | P2-006 | Redis caching layer (question pools + sessions) | MUST |
| ⏳ | P2-007 | Cohort tag management | MUST |
| ⏳ | P2-008 | Admin dashboard (login count, study time, scores, progress) | MUST |
| ⏳ | P2-009 | Admin roles and ID registration (RBAC) | MUST |
| ⏳ | P2-010 | Excel export — one click (.xlsx) | MUST |
| ⏳ | P2-011 | Test attempt history view | MUST |

---

## Phase 3 — Auth Upgrade, Payments & Anti-Cheating (July 2026+)

| Status | Task ID | Domain | Priority |
|---|---|---|---|
| ⏳ | P3-001 | Invitation-based email auth (JWT + bcrypt) | MUST |
| ⏳ | P3-002 | ID-to-email migration (preserve history) | MUST |
| ⏳ | P3-003 | Payment integration — 500 BDT (bKash / Stripe) | DEFER |
| ⏳ | P3-004 | In-app camera (WebRTC) | DEFER |
| ⏳ | P3-005 | Tab-switch detection (Page Visibility API) | DEFER |
| ⏳ | P3-006 | Lecture videos (YouTube embed) | DEFER |

---

## Phase 4 — AI-Enhanced Learning & Localisation (Post-July 2026)

| Status | Task ID | Domain | Priority |
|---|---|---|---|
| ⏳ | P4-001 | Gemini AI speech evaluation (geminiSpeechService.ts) | DEFER |
| ⏳ | P4-002 | AI-driven adaptive practice (weight by error history) | DEFER |
| ⏳ | P4-003 | Bengali UI localisation (i18next BN strings) | DEFER |
| ⏳ | P4-004 | Advanced analytics dashboard (cross-cohort trends) | DEFER |

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
| 2026-04-22 | P0-001 | Color palette and visual tone | Completed |
| 2026-04-22 | P0-004 | Monorepo and workspace setup | Completed |
| 2026-04-22 | P0-005 | Database schema (Drizzle + Neon) | Completed |
| 2026-04-22 | P0-006 | Express gateway to FastAPI proxy | Completed |
