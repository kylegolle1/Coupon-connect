# Coupon Connect — rules for every Claude Code agent

## What we are building
A free app for budget-conscious shoppers. Major retail and grocery chains post
coupons; shoppers open a coupon and it shows as a scannable barcode on their
phone at the register. Coupons update themselves (new ones appear, expired ones
disappear) without the shopper doing anything.

Two sides:
- **Shopper app**: browse/search coupons by store, save to a wallet, show barcode
  full-screen at checkout (bright screen, large bars), see expiry dates.
- **Store portal**: a store staff member signs in, creates/edits/ends coupons
  (title, discount, barcode value + format, start/end date, terms, image).

## Tech stack (GUESS — the planner may change this, and must record why in docs/decisions.md)
- Web app installable on phones (PWA): Next.js + TypeScript + Tailwind CSS.
- Database, sign-in and file storage: Supabase (Postgres).
- Barcodes: `bwip-js` (supports UPC-A, EAN-13, Code 128, GS1 DataBar, QR).
- Tests: Vitest for logic, Playwright for click-through tests on a phone-sized screen.
- Hosting: Vercel (only when kyle says to deploy).

## Ground rules
1. **Plain English for kyle.** kyle is not a developer. Every summary to kyle says
   what changed and how to see it, with no jargon. Explain any unavoidable term.
2. **Small steps.** One feature per branch and pull request. Never push to `main` directly.
3. **Ask before anything that can't be undone or costs money**: deploying, deleting data,
   adding paid services, emailing stores, publishing to app stores.
4. **No secrets in code.** Keys go in `.env.local` (never committed). Keep `.env.example` up to date.
5. **Barcodes must scan.** Any change to barcode display is tested by rendering each
   supported format and decoding it back (see QA agent).
6. **Expired coupons never show** in the shopper app. Dates are stored in UTC and
   compared on the server.
7. **Accessibility and cheap phones.** Must work on a small, older Android phone on slow data.
   Large tap targets, readable contrast, works offline for saved coupons.
8. **Write down decisions** in `docs/decisions.md` (date, decision, why) and the feature
   backlog in `docs/backlog.md`.

## The team (in .claude/agents/)
| Agent | Job |
|---|---|
| `project-manager` | Oversees everything: assigns work, keeps the status board, reports to kyle. |
| `market-researcher` | Statistics and evidence: how people rate existing coupon apps and what shoppers want. |
| `product-planner` | Turns kyle's idea into small, clear tasks with "done when" checks. Writes no code. |
| `backend-dev` | Database tables, sign-in, coupon rules, the auto-update/expiry jobs, store APIs. |
| `frontend-dev` | Screens shoppers and store staff see, barcode display, offline wallet. |
| `qa-tester` | Writes and runs tests, checks barcodes actually scan, tries to break things. |
| `code-reviewer` | Final check for bugs, security and privacy before anything is merged. Read-only. |

## Standard workflow
Run `/build-feature <what you want>`. The project manager runs it:
research (if needed) → plan → build (backend, then frontend) → test → review →
pull request → plain-English summary for kyle. It updates the status board
(`docs/team-status.json`) at every step.

## Research
Shopper and competitor evidence lives in `docs/research/`. Use it when deciding features.
Key facts: expired/broken coupons are shoppers' top frustration (26%), "too many apps" (17%),
and digital-only coupons are criticised for leaving out seniors and lower-income shoppers.

## Commands
(Filled in by the first agent that sets up the project, e.g. `npm run dev`, `npm test`.)
