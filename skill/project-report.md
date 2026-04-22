# B-JET Hiragana & Katakana Learning App — Project Report
> Draft v1.1 · April 2026 · Use this file as the authoritative spec reference for every implementation decision.

---

## 1. Executive Summary

The B-JET Hiragana & Katakana Learning App is a web platform for Bangladesh–Japan IT Engineer Training Program (B-JET) trainees to self-study Japanese script before the official July mastery test. It consolidates pre-learning reference charts, unlimited self-check practice, and a timed formal mastery test in one mobile-friendly application, while giving B-JET office administrators remote visibility into learner progress across cohorts.

| Field | Value |
|---|---|
| Project | B-JET Hiragana & Katakana Learning App |
| Program | Bangladesh–Japan IT Engineer Training Program |
| Target users | ~800 B-JET applicants / trainees (Bangladesh-based) |
| Admin users | 5–10 administrators |
| Phase 1 launch | Early June 2026 |
| Phase 2 launch | End of June 2026 |
| UI language | English (Bengali localisation in Phase 4) |
| Document ver. | Draft v1.1 · April 2026 |

---

## 2. System Overview

### Purpose and Context
B-JET trainees must demonstrate proficiency in Hiragana and Katakana — Japan's two phonetic scripts — before participating in the programme. No dedicated digital tool previously existed; learners relied on printed materials. This platform replaces that gap with an interactive, progress-tracking environment that also enables the B-JET office to monitor cohort-wide readiness remotely.

### Design Philosophy
Every product decision is filtered through one question: **Would a nervous first-time learner enjoy this?** The app must feel like a friendly tool, not an exam system.

| Principle | Detail |
|---|---|
| Simple by default | One clear action per screen. The learner should never wonder what to tap. |
| Colorful and warm | Friendly palette reduces anxiety. Approachable, not corporate. |
| Instant feedback | Every interaction produces a visible response within 100ms. |
| User-connected | The app remembers progress, celebrates wins, speaks encouragingly. |
| Low cognitive load | Maximum 5 elements on screen at once. Whitespace is a feature. |
| Mobile-first | Built for a phone in Dhaka. Minimum 44px touch targets, thumb-operable. |

---

## 3. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | React 18 + TypeScript | Core UI framework. Type safety and component reusability. |
| Frontend | Vite | Build tool. Near-instant HMR; optimised production bundles. |
| Frontend | Tailwind CSS + Radix UI | Utility-first styling with accessible primitives. Consistent design tokens. |
| Frontend | React Query | Server-state management. Automatic caching and background refresh. |
| Frontend | React Hook Form + Zod | Form handling with schema validation. Minimal re-renders. |
| Frontend | Wouter | Lightweight client-side routing. |
| Frontend | i18next | Internationalisation for JP / EN / BN. Scaffolded from Phase 0. |
| Gateway | Node.js + Express | Proxy layer. Auth middleware, rate limiting, request logging. |
| Core API | FastAPI + Python 3.11+ | Async API with automatic OpenAPI docs; Pydantic-validated endpoints. |
| Core API | SQLAlchemy 2.0 Async | Async ORM with full async support. Prevents blocking under load. |
| Core API | Pydantic v2 | Request/response model validation and serialisation. |
| Core API | python-jose + passlib/bcrypt | JWT generation and password hashing (Phase 3 email auth). |
| Core API | Redis | Caches question pools and active sessions during July exam load. |
| Core API | Uvicorn | Production ASGI server for FastAPI. |
| Database | PostgreSQL (Neon Cloud) | Serverless, auto-scaling Postgres. No infrastructure management. |
| Database | Drizzle ORM | Schema definitions and type-safe migrations. |
| Database | asyncpg | Async PostgreSQL driver. Non-blocking database calls. |
| AI / Media | Google Gemini API | AI speech evaluation in Phase 4 via geminiSpeechService.ts. |
| AI / Media | Web Speech API + MP3 fallback | Character audio. Browser synthesis primary; MP3 for low bandwidth. |

---

## 4. Development Schedule

Total estimated time for Phase 1 and Phase 2: approximately 7 weeks.

| Phase | Target | Key Deliverables | Milestone |
|---|---|---|---|
| Phase 0 — Foundation | Weeks 1–2, May 2026 | Design system, monorepo, DB schema, Express gateway, CI/CD, i18next | Dev environment ready |
| Phase 1 — Core Learning | Early June 2026 | ID login, learning charts, audio playback, self-check, progress bar, badges | LAUNCH — main entry registration |
| Phase 2 — Test + Admin | End of June 2026 | Mastery test engine, result screens, admin dashboard, Excel export | Ready for July mastery test |
| Phase 3 — Auth + Pay | July 2026 onwards | Email auth, migration, 500 BDT payment, in-app camera, tab detection | Post-July test additions |
| Phase 4 — AI + L10n | Post-July 2026 | Gemini speech evaluation, adaptive practice, Bengali UI, analytics | Long-term platform growth |

---

## 5. Feature Specification

### 5.1 Authentication

Phase 1 uses a lightweight applicant-ID login with no password. The B-JET office pre-assigns IDs (e.g. `BJET-2025-0123`); login is granted if the ID exists in the registered list. Impersonation risk is accepted at this stage because the July test is Zoom-supervised with cameras on. Phase 3 upgrades to invitation-based email auth using JWT and bcrypt.

| Phase | Feature | Detail | Priority |
|---|---|---|---|
| Phase 1 | Applicant ID login | Single input and button. Auto-formats BJET-YYYY-XXXX as user types. | MUST |
| Phase 1 | Welcome screen | Post-login greeting with learner name and illustration. | MUST |
| Phase 3 | Invitation email auth | Pre-registered emails only. JWT + bcrypt via python-jose/passlib. | MUST |
| Phase 3 | ID-to-email migration | Binds email to existing account; full history preserved. | MUST |

### 5.2 Pre-Learning Charts and Vocabulary

All 46 Hiragana and 46 Katakana characters are presented in colour-coded Gojuon charts. Tapping any cell enlarges it and plays audio. A vocabulary list pairs characters with images and emoji to anchor meaning visually.

| Feature | Detail | Priority |
|---|---|---|
| Hiragana chart (46 chars) | Tap-to-hear; colour-coded rows by vowel family. | MUST |
| Katakana chart (46 chars) | Same layout as Hiragana; toggle between scripts. | MUST |
| Audio playback | Web Speech API primary; pre-recorded MP3 fallback for low bandwidth. | MUST |
| Vocabulary list | Image and emoji-annotated words. Character + meaning + picture. | MUST |

### 5.3 Self-Check Practice

The primary daily-use feature. Supports typing mode (learner types the romanisation, e.g. 'ka') and multiple-choice mode (four options). Attempts are unlimited.

| Field | Value |
|---|---|
| Target characters | 46 Hiragana + 46 Katakana (separate or combined mixed mode) |
| Input formats | Typing (romanisation) and multiple-choice (4 options) |
| Alternate readings | Accepts shi/si, chi/ti, fu/hu via an aliases array |
| Correct feedback | Encouraging animation and positive message |
| Wrong feedback | Gentle indicator + correct answer shown — never accusatory |
| Score tracking | Running correct / incorrect / accuracy % live per session |
| Streak counter | Consecutive-correct streak displayed |
| Attempt limit | Unlimited |
| History | Each session score saved per user with full in-app history list |

### 5.4 Mastery Test

A formal, timed examination of 20 randomly selected characters from the full 92-character pool. A server-authoritative 10-minute timer prevents client-side manipulation.

| Field | Value |
|---|---|
| Question pool | All 92 characters (46 Hiragana + 46 Katakana) |
| Questions per test | 20 — randomly selected, no repeats within one attempt |
| Time limit | 10 minutes — server-authoritative timer |
| Pass mark | 80% (16/20) — pass/fail visible to admins only |
| Score visibility | Raw score visible to learner after submission |
| Attempts | Multiple attempts allowed; full history accessible to admins |
| Test UI | Navigation hidden during test — only question, input, and timer shown |
| Start screen | Clear pre-test screen: 20 questions, 10 minutes, 80% to pass |
| Result screen | Pass: celebratory animation and badge. Fail: encouraging message and Try Again |
| Anti-cheating | Phase 1-2: Zoom supervision. Phase 3: in-app camera and tab-switch detection |

### 5.5 Progress Tracking and Gamification

| Feature | Detail | Priority |
|---|---|---|
| Progress bar | Characters mastered out of 46 (e.g. 23/46 Hiragana mastered). | MUST |
| Daily streak | Consecutive days studied — shown on the home screen. | MUST |
| Achievement badges | First 10, All Hiragana, All Katakana, 7-day streak. | MUST |
| Study time display | Today's study time shown to the learner. | MUST |

---

## 6. Admin Dashboard

Access restricted to registered admin accounts via RBAC, separated from learner access.

| Metric | Description | Granularity |
|---|---|---|
| Login count | Number of logins per user and per cohort. | Per user / Per cohort / Date range |
| Study time | Total time in app tracked at page level. | Per user / Per session / Cumulative |
| Test scores | Full attempt history, highest score, pass/fail flag. | Per attempt / Per user / Cohort |
| Progress rate | Characters mastered out of 46. | Per character / Per user |
| Cohort filter | Filter all views by cohort tag. | Cross-cohort comparison |
| Excel export | Download all visible data as .xlsx in one click. | Reflects active filter state |

### Cohort and User Management
Each learner is tagged with a cohort (e.g. Batch 16, Batch 17). New intakes add users without removing previous cohorts — all historical data is retained. Admins can register and remove applicant IDs and edit cohort tags.

---

## 7. UI/UX Design Guidelines

Binding rules across all screens and phases:

| Rule | Requirement |
|---|---|
| One action per screen | Ideally one CTA per screen. The learner should never be confused about what to tap. |
| Color restraint | Simple, limited palette. Soft and warm tones. Nothing harsh or corporate. |
| Touch target size | Minimum 44 x 44px for all interactive elements. Thumb-operable on mobile. |
| Feedback speed | Every interaction must have a visible response within 100ms. |
| Encouraging language | Not 'Error occurred' — 'Oops, let's try again.' Not 'Incorrect' — 'So close!' |
| Whitespace | Max 5 elements per screen. Generous padding builds trust and reduces anxiety. |
| Accessibility | ARIA labels, AA contrast (4.5:1 minimum), full keyboard navigation. |
| Animation budget | All micro-interactions capped at 150–300ms. Snappy, not flashy. |

---

## 8. Implementation Roadmap Summary

### Phase 0 — Design System & Project Foundation

| Domain | Description | Priority |
|---|---|---|
| Color palette and visual tone | Warm, approachable palette — define emotional tone first. | MUST |
| Radix UI + Tailwind component kit | Unified Button, Card, Modal, Toast primitives across all screens. | MUST |
| Typography (Kana + Latin) | Noto Sans JP for kana; Inter for Latin text. Large and readable. | MUST |
| Monorepo and workspace setup | Vite + React + Express gateway + FastAPI in a single repository. | MUST |
| Database schema (Drizzle + Neon) | Users, cohorts, practice history, test attempts tables. | MUST |
| Express gateway to FastAPI proxy | Centralised auth, rate-limiting, and logging layer. | MUST |
| CI/CD and hosting | Vercel + Render/Railway; region chosen for Bangladesh latency. | MUST |
| i18next setup (JP/EN/BN scaffold) | English-only Phase 1; Bengali added in Phase 4 without refactor. | MUST |

### Phase 1 — Core Learning Experience (Early-June Launch)

| Domain | Description | Priority |
|---|---|---|
| Applicant ID login | Single input and button; auto-format BJET-YYYY-XXXX. | MUST |
| Friendly welcome screen | Post-login greeting with learner name and illustration. | MUST |
| Learner home — 3 big cards | Learn / Practice / Test cards. Zero ambiguity. | MUST |
| Pre-learning charts | Gojuon chart; tap to enlarge and play audio; colour-coded rows. | MUST |
| Audio playback | Web Speech API primary; pre-recorded MP3 fallback. | MUST |
| Vocabulary list with images | Character + meaning + picture anchored together. | MUST |
| Self-check practice | Typing and multiple choice; encouraging feedback on every answer. | MUST |
| Progress bar and daily streak | 23/46 progress bar and consecutive-days streak counter. | MUST |
| Achievement badges | Badges for First 10, All Hiragana, All Katakana, 7-day streak. | MUST |
| Study time tracking | Page-level dwell time — feeds admin metric and learner display. | MUST |
| Mobile-first responsive UI | 44px touch targets; key actions reachable one-handed. | MUST |
| Accessibility pass | ARIA labels, AA contrast (4.5:1), full keyboard navigation. | MUST |
| Micro-interactions | Button bounce, confetti on correct, page fade — all 150–300ms. | MUST |

### Phase 2 — Mastery Test & Admin Dashboard (End-June Launch)

| Domain | Description | Priority |
|---|---|---|
| Test start screen | Calm pre-test screen: 20 Qs, 10 min, 80% to pass. | MUST |
| Mastery test engine | Random 20Q from 92-char pool; server-authoritative 10-min timer. | MUST |
| Clean test-taking UI | Navigation hidden; question, input, and timer only. | MUST |
| Result screen | Pass: confetti. Fail: encouraging message and Try Again CTA. | MUST |
| Scoring and pass/fail logic | 80% threshold; pass/fail admin-only; score visible to learner. | MUST |
| Redis caching layer | Cache question pools and sessions for July exam load. | MUST |
| Cohort tag management | Tag learners by intake batch; filter all dashboard views. | MUST |
| Admin dashboard | Login count, study time, test scores, progress — filterable. | MUST |
| Admin roles and ID registration | Register / remove IDs, edit cohort tags; RBAC separation. | MUST |
| Excel export — one click | Export all or filtered data as .xlsx; no multi-step dialogs. | MUST |
| Test attempt history view | Chronological attempts with best score, pass/fail, time taken. | MUST |

### Phase 3 — Auth Upgrade, Payments & Anti-Cheating (July+)

| Domain | Description | Priority |
|---|---|---|
| Invitation-based email auth | Pre-registered emails only; JWT + bcrypt. | MUST |
| Migration from ID login | Bind email to existing account without losing history. | MUST |
| Payment integration (500 BDT) | bKash / Stripe; start with admin-confirmed manual grants. | DEFER |
| In-app camera (WebRTC) | Replace Zoom-based ID verification with in-app webcam. | DEFER |
| Tab-switch detection | Log window-blur events for admin audit after test. | DEFER |
| Lecture videos | YouTube embed first; AI-generated content later. | DEFER |

### Phase 4 — AI-Enhanced Learning & Localisation (Post-July)

| Domain | Description | Priority |
|---|---|---|
| Gemini AI speech evaluation | Evaluate kana pronunciation via geminiSpeechService.ts. | DEFER |
| AI-driven adaptive practice | Infer weak characters from errors; weight question pool accordingly. | DEFER |
| Bengali UI localisation | Add Bengali strings to the i18next scaffold from Phase 0. | DEFER |
| Advanced analytics dashboard | Cross-cohort trends, pass prediction, drop-off reports. | DEFER |

---

## 9. Infrastructure and Deployment

| Layer | Service | Rationale | Cost Model |
|---|---|---|---|
| Frontend | Vercel | Edge CDN; auto preview deployments. Spec-recommended host. | Free tier |
| Gateway | Render / Railway | Node.js/Express container. Singapore region for BD latency. | Pay-per-use |
| Core API | Render / Railway | FastAPI container; auto-scales for July exam traffic. | Pay-per-use |
| Database | Neon Cloud | Serverless Postgres; auto-pause idle; branching for migrations. | Free to Scale |
| Cache | Upstash Redis | Serverless Redis; per-request pricing; no idle cost. | Free tier |
| CI/CD | GitHub Actions | Lint, type-check, test, deploy on merge to main. | Free |
| AI | Gemini API | Phase 4 speech evaluation; pay-per-call pricing. | Phase 4 only |

---

## 10. Security and Risk Considerations

| Risk | Level | Description | Mitigation |
|---|---|---|---|
| ID impersonation | Medium | Anyone with a valid ID can log in. | Accepted in Phase 1 — Zoom-supervised test. Resolved in Phase 3. |
| Exam cheating | Medium | Tab switching, screen sharing, ID lending. | Zoom cameras Phase 1-2. Phase 3 adds in-app camera and tab detection. |
| Bangladesh latency | Low | CDN edge distance; packet loss on mobile. | Vercel edge + Singapore backend. MP3 audio fallback. Progressive load. |
| July exam load spike | Medium | ~800 concurrent users during the official test. | Redis caches question pools. Neon auto-scales. Load tested pre-launch. |
| Data privacy | Low | Learner scores and login data stored in cloud. | Postgres encrypted at rest. Env vars via secret manager, not repo. |
| Payment fraud | Medium | bKash reversals or false payment claims (Phase 3). | Admin manually verifies payment before granting access initially. |

---

## 11. Mini Task — Application Submission

All developer applicants must submit a mini task: a single web page that displays a random Hiragana character, accepts romanisation input, shows whether the answer is correct or incorrect, and has a Next button. **Deadline: 26 April 2026, 11:59 PM BST.**

### Core Requirements

| Req | Feature | Implementation Detail |
|---|---|---|
| #1 | Random character display | Random selection on mount and Next click. Never repeats same character consecutively. |
| #2 | Romanisation input | Controlled input; autofocus; Enter-to-submit; trim and lowercase normalisation. |
| #3 | Correct/incorrect feedback | Color and message. Correct: positive animation. Wrong: gentle indicator + correct answer. |
| #4 | Next button | Advances to new random character. Disabled before submission to prevent skipping. |

### Submission Checklist
- Deploy to Vercel with a clean, memorable project slug
- Push to a public GitHub repo with meaningful commit messages and a proper .gitignore
- Write a README with screenshots, run instructions, Lighthouse scores, and a design note
- Run Lighthouse on the production URL — target Performance >= 90, Accessibility >= 95
- Submit: GitHub profile link + live URL + repo URL + brief experience note

---

## 12. Future Considerations

| Feature | Phase | Notes |
|---|---|---|
| Email auth migration | Phase 3 | Invitation-based signup replaces ID-only login permanently. |
| In-app camera | Phase 3 | WebRTC webcam verification replaces Zoom supervision. |
| Tab-switch detection | Phase 3 | Page Visibility API logs focus-loss events for admin audit. |
| Bangladesh payment (bKash) | Phase 3 | 500 BDT/user payment gate; starts with admin-confirmed grants. |
| AI lecture videos | Phase 3 | YouTube embeds first; AI-generated content later. |
| Gemini speech evaluation | Phase 4 | AI pronunciation feedback via google-genai SDK. |
| Adaptive practice engine | Phase 4 | Infer weak characters from error history; weight questions. |
| Bengali UI localisation | Phase 4 | Add Bengali strings to the i18next scaffold from Phase 0. |
| Advanced analytics | Phase 4 | Cross-cohort trends, pass-rate prediction, drop-off tracking. |

---

## 13. Document Version History

| Date | Version | Changes | Author |
|---|---|---|---|
| 21 Apr 2026 | v1.0 | Initial full project report. Aligned with Spec v0.3. Phases 0–4 defined. | B-JET Dev Team |
| 21 Apr 2026 | v1.1 | Added UI/UX-first design philosophy. Design system phase, welcome screen, progress bar, badges, micro-interactions, UX guideline table. | B-JET Dev Team |
