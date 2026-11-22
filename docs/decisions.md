# Decisions (date — decision — why)

- 2026-11-22 — Start as an installable web app (PWA) rather than App Store apps — one codebase works on iPhone and Android, no app-store review, cheaper to start. (GUESS, revisit later.)
- 2026-11-22 — Supabase for database and sign-in — free tier, handles store/shopper permissions. (GUESS.)
- 2026-11-22 — Barcodes are drawn on the server as SVG with bwip-js, so they look sharp and need no extra download on the phone.
- 2026-11-22 — Expired coupons are filtered on the server and in the database rules; an expired coupon's page shows "not available" instead of a barcode.
