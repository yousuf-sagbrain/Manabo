# B-JET Mini Task Implementation Roadmap (v1.0)
> This roadmap is the authoritative guide for the Manabo mini task submission. Every domain maps to a spec section. Use this file to track implementation status and understand the rationale behind each decision.

---

## Task Brief

Build a single-page Hiragana quiz that shows a random character, accepts romanisation input, displays correctness, and advances with a "Next" button.

- **Deadline:** Sunday, 26 April 2026 — 11:59 PM BST
- **Deliverables:** Public deployment URL + GitHub repo link
- **Philosophy:** Meet every requirement, then use the aligned stretch goals to demonstrate fit for the full B-JET project — without scope-creeping past the brief.

---

## Positioning Strategy

Most applicants will submit a minimal `index.html`. This roadmap stands out by:
1. Meeting 100% of the stated requirements
2. Surfacing the actual project stack (React 18 + TS + Vite + Tailwind)
3. Positioning the submission as a miniature of the Phase 1 Self-Check feature

---

## Phase Ordering

| Phase | Name | Goal |
|---|---|---|
| Phase 0 | Core Requirements | Must-have, non-negotiable |
| Phase 1 | Standout Polish | What makes this submission memorable |
| Phase 2 | Deployment & Submission Package | First impression — no cutting corners |
| Phase 3 | Post-Submission / Interview Prep | Optional but recommended |

---

## Phase 0: Core Requirements — 100% Coverage

Miss any of these and nothing else matters. Top priority.

| Status | No. | Domain | Priority | Purpose & Rationale |
|---|---|---|---|---|
| ⏳ | 0 | Vite + React 18 + TypeScript Scaffold | MUST | Scaffold with the same Vite + React 18 + TS the real project uses — signals drop-in readiness on day one. Use `create-vite` template. |
| ⏳ | 1 | Hiragana Dataset (46 characters) | MUST | Static array of all 46 gojūon as `{ char: 'か', romaji: 'ka' }`. Account for alternate romanisations (shi/si, chi/ti) via an `aliases: string[]` field. |
| ⏳ | 2 | Random Character Display (Requirement #1) | MUST | Random selection on mount and on Next. Small polish: **never show the same character twice in a row** — a detail most applicants will miss. |
| ⏳ | 3 | Romaji Input Field (Requirement #2) | MUST | Controlled input with autofocus, Enter-to-submit, and normalisation (trim + lowercase) so "KA ", "Ka", "ka" all work. |
| ⏳ | 4 | Correct / Incorrect Feedback (Requirement #3) | MUST | Colour + text feedback. On wrong answer, show the correct romaji — converting the quiz into a **learning moment**, not just a pass/fail. |
| ⏳ | 5 | Next Button (Requirement #4) | MUST | Advances to a new random character. Disabled before an answer is submitted to prevent skip-abuse. Keyboard accessible (Space / Enter). |

---

## Phase 1: Standout Polish — What Sets This Apart

This is where reviewers remember you. Calibrated additions — not feature bloat.

| Status | No. | Domain | Priority | Purpose & Rationale |
|---|---|---|---|---|
| ⏳ | 6 | Tailwind CSS Styling | MUST | Matches the real project's styling approach — using Tailwind (rather than vanilla CSS) demonstrates stack fluency. |
| ⏳ | 7 | Session Score Tracker (○/total) | MUST | Running correct/incorrect/accuracy counter — a miniature of Spec §6 "Score Saving". Instantly signals you read the spec. |
| ⏳ | 8 | Audio Playback via Web Speech API | DEFERRABLE | Clickable pronunciation using the Web Speech API — the exact approach named in Spec §9. A clear "I read your spec" signal. |
| ⏳ | 9 | Keyboard-First UX (Enter = submit, Space = next) | MUST | Fully keyboard-operable so a learner can grind practice without touching the mouse — shows empathy for the actual user. |
| ⏳ | 10 | Mobile-Responsive Layout | MUST | Spec explicitly requires mobile browser support. Submission must look and work well on a phone — not just desktop. |
| ⏳ | 11 | Dark / Light Mode Toggle | DEFERRABLE | Respects `prefers-color-scheme` with a manual override — a small signal of attention to detail that costs almost nothing. |
| ⏳ | 12 | A11y Pass (ARIA + Contrast + Focus Ring) | MUST | Aligns with the real project's Radix UI foundation. `aria-live` announces correctness to screen readers — a quality bar few applicants will hit. |
| ⏳ | 13 | Mode Toggle: Typing ⇌ Multiple Choice | DEFERRABLE | Spec §6 says "one or both formats to be implemented." Delivering both in the mini task previews the real deliverable. |
| ⏳ | 14 | Subtle Micro-Interactions | DEFERRABLE | Subtle fade on character change, gentle pulse on correct/incorrect. Restraint is the skill — not flashiness. |

---

## Submission Boundary — 26 April 2026, 11:59 PM BST

---

## Phase 2: Deployment & Submission Package

This is the first impression. No cutting corners.

| Status | No. | Domain | Priority | Purpose & Rationale |
|---|---|---|---|---|
| ⏳ | 15 | Vercel Deployment (Production URL) | MUST | Uses Vercel — named in Spec §9 as a recommended host. Configure a clean, memorable project slug for the submission URL. |
| ⏳ | 16 | Public GitHub Repo with Clean History | MUST | Meaningful commit messages, a proper `.gitignore`, clean branch strategy — the repo itself is evaluated, not just what it builds. |
| ⏳ | 17 | Excellent README (Screenshots + Run + Design Notes) | MUST | Screenshots, run instructions, design notes, and an explicit "how this maps to the real project" section. Reviewers will read it. |
| ⏳ | 18 | LICENSE + package.json Metadata | DEFERRABLE | MIT LICENSE, author, description filled in — the final 2% of professionalism that rounds out the package. |
| ⏳ | 19 | Lighthouse Pass (Perf / A11y / Best Practices ≥ 95) | MUST | Run Lighthouse on the production URL, paste the scores into the README. Proves "I measure what I ship." |
| ⏳ | 20 | Application Message (GitHub + URL + Experience Note) | MUST | Per the brief: GitHub profile, live URL, repo URL, and a short relevant-experience note (auth / quizzes / dashboards). |

---

## Phase 3: Post-Submission & Interview Prep (Optional but Recommended)

Preparation that pays off if shortlisted. The final differentiator.

| Status | No. | Domain | Priority | Purpose & Rationale |
|---|---|---|---|---|
| ⏳ | 21 | Design Doc / Architecture Sketch | DEFERRABLE | A 1–2 page doc outlining how you'd build the full project — instant talking points in any follow-up interview. |
| ⏳ | 22 | "Why This Stack Fits" Note | DEFERRABLE | A written articulation of why the chosen stack (FastAPI + Express gateway, Neon + Drizzle) works — good interview warm-up. |
| ⏳ | 23 | Katakana Mode Extension (Optional Live Demo) | DEFERRABLE | A branch/demo adding Katakana toggle — proves the Phase 1 code scales cleanly to the real scope. |
| ⏳ | 24 | Admin Dashboard Mockup (Figma or static React page) | DEFERRABLE | A static mock of Spec §8's admin dashboard. Visually communicates that you've already thought through Phase 2. |

---

## Differentiation Summary

| Axis | Typical Submission | This Submission |
|---|---|---|
| Stack | Vanilla HTML + JS | React 18 + TS + Vite + Tailwind — same as the real project |
| Requirements | 4 requirements, minimum | 4 requirements + learning value + no-repeat guard |
| Scope | 1 page, 1 feature | 1 page condensing self-check practice (score, audio, mode toggle) |
| README | Project name + run instructions only | Screenshots · Lighthouse results · project mapping notes |
| Submission | URL + repo | URL + repo + Lighthouse + design notes + experience memo |
| Spec comprehension | Not mentioned | Implementation choices explicitly reference Spec §6, §8, §9 |

---

## Status Legend

| Emoji | Meaning |
|---|---|
| ⛔ | Not yet designed |
| ⏳ | To-Do (not started) |
| 🏃 | In-Progress (implementing) |
| ✅ | Completed (finished & tested) |

Update the Status column as each domain completes. Before submission, verify every row in Phase 0, 1, and 2 shows ✅.
