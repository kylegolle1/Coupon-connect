# Decisions (date — decision — why)

- 2026-11-22 — Start as an installable web app (PWA) rather than App Store apps — one codebase works on iPhone and Android, no app-store review, cheaper to start. (GUESS, revisit later.)
- 2026-11-22 — Supabase for database and sign-in — free tier, handles store/shopper permissions. (GUESS.)
- 2026-11-22 — Barcodes are drawn on the server as SVG with bwip-js, so they look sharp and need no extra download on the phone.
- 2026-11-22 — Expired coupons are filtered on the server and in the database rules; an expired coupon's page shows "not available" instead of a barcode.
- 2026-11-22 — The app reads from Supabase when its URL and public key are set, and falls back to sample data otherwise, so it always runs during development.
- 2026-11-23 — kyle chose the shopper flow: sign in → store → item → barcode (concept D on the design canvas). Picked over A (one combined barcode per store), which the team had recommended.
- 2026-11-23 — Sign-in uses an emailed one-tap link instead of a password: nothing to forget, and fewer support problems. (GUESS, easy to change.)
- 2026-11-23 — A store's item list shows only items with a live discount; searching for anything else says "No discount right now". We have no full product catalogue from stores yet. (GUESS.)
- 2026-11-23 — With no Supabase settings, the app runs in sample mode with no sign-in, so developers and tests can use it.
