# Your AI development team — how to use it

## What this is
A set of instruction files that turn Claude Code into a small software team for
Coupon Connect. Each "agent" is a specialist with its own job:

- **Project manager**: oversees the whole team, hands out the work, keeps the status
  board for your visual office, and reports to you in plain words.
- **Market researcher**: digs up statistics on how people rate apps like Flipp, Ibotta and
  Fetch, and what shoppers say they want.
- **Planner**: turns your idea into small, checkable steps. Writes no code.
- **Backend developer**: the behind-the-scenes parts: database, sign-in, coupons expiring on their own.
- **Frontend developer**: everything you see and tap: coupon list, wallet, the barcode screen.
- **Tester**: tries to break things and checks the barcodes really scan.
- **Reviewer**: a final safety check before anything is accepted.

The file `CLAUDE.md` is the team rulebook every agent reads first (what the app is,
the rules, ask kyle before spending money or going live).

## Files
```
CLAUDE.md                     team rulebook
.claude/agents/*.md           the five team members
.claude/commands/build-feature.md   the "run the whole team" shortcut
docs/backlog.md               the to-do list of features
docs/decisions.md             why we chose what we chose
docs/research/                market research and statistics
docs/team-status.json         who is doing what right now (feeds your visual office)
```

## How to use it (once the code has a home)
1. These files go in the top folder of the app's code (a GitHub repository).
2. Open Claude Code in that folder.
3. Type, for example:
   `/build-feature store staff can create a coupon with a barcode and expiry date`
4. The team plans it, shows you the plan, builds it, tests it, reviews it, and opens a
   "pull request" (a proposed change you can look at before accepting it). Nothing goes
   live without your OK.

You can also call one specialist directly, e.g. "use the qa-tester agent to check the wallet screen".

## Things marked GUESS
The tech choices (installable web app, Supabase database, Vercel hosting) and the
feature order in the backlog are my best guesses. Change them any time.
