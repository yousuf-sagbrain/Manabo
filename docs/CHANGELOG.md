# Changelog
> Managed by `COMMIT_SKILL.md`. New entries are prepended at the top.

---

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
