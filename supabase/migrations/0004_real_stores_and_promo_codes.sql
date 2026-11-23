-- Real, legal deals only.
-- 1) Stores can link to their OWN coupon page/app. We never copy their coupons or barcodes.
-- 2) The made-up sample stores are marked as demo, so shoppers don't see them. Nothing is deleted.
-- 3) A promo_codes table for online codes from a licensed feed (e.g. LinkMyDeals). Codes only, never barcodes.

alter table stores add column if not exists is_demo boolean not null default false;
alter table stores add column if not exists coupons_url text;

update stores set is_demo = true where id in (
  '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555');

insert into stores (id, name, color, coupons_url) values
  ('a0000000-0000-4000-8000-000000000001', 'Kroger', '#1d4ed8', 'https://www.kroger.com/savings/cl/coupons/'),
  ('a0000000-0000-4000-8000-000000000002', 'Safeway', '#b91c1c', 'https://www.safeway.com/foru/coupons-deals.html'),
  ('a0000000-0000-4000-8000-000000000003', 'Target', '#be123c', 'https://www.target.com/circle'),
  ('a0000000-0000-4000-8000-000000000004', 'CVS Pharmacy', '#9f1239', 'https://www.cvs.com/extracare/home'),
  ('a0000000-0000-4000-8000-000000000005', 'Walgreens', '#991b1b', 'https://www.walgreens.com/offers/offers.jsp')
on conflict (id) do nothing;

create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  title text not null,
  code text,                      -- null = no code needed, the link applies the deal
  url text not null,              -- where to shop online
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  source text not null,           -- which licensed feed it came from
  source_id text,                 -- the feed's own id, so re-syncing doesn't duplicate
  created_at timestamptz not null default now(),
  unique (source, source_id)
);
create index if not exists promo_codes_live_idx on promo_codes (store_id, ends_at);

alter table promo_codes enable row level security;
drop policy if exists "public reads live promo codes" on promo_codes;
create policy "public reads live promo codes" on promo_codes for select
  using (starts_at <= now() and now() < ends_at);
grant select on promo_codes to anon, authenticated;
