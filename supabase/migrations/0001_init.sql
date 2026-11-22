-- Coupon Connect: first database layout (Supabase / Postgres).
-- Not applied anywhere yet: needs a Supabase project (kyle's approval) first.

create table stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#2149c9',
  created_at timestamptz not null default now()
);

-- Which signed-in users are staff of which store.
create table store_members (
  store_id uuid not null references stores(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (store_id, user_id)
);

create type barcode_format as enum ('upca', 'ean13', 'code128', 'databarexpanded', 'qrcode');

create table coupons (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  value text not null check (char_length(value) <= 24),
  title text not null check (char_length(title) <= 120),
  category text not null,
  barcode_value text not null,
  barcode_format barcode_format not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  terms text not null default '',
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index coupons_active_idx on coupons (ends_at, starts_at);

-- A shopper's saved coupons.
create table saved_coupons (
  user_id uuid not null references auth.users(id) on delete cascade,
  coupon_id uuid not null references coupons(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, coupon_id)
);

alter table stores enable row level security;
alter table store_members enable row level security;
alter table coupons enable row level security;
alter table saved_coupons enable row level security;

-- Anyone can see stores and coupons that are live right now. Expired ones are never returned.
create policy "public reads stores" on stores for select using (true);
create policy "public reads live coupons" on coupons for select
  using (starts_at <= now() and now() < ends_at);

-- Store staff can see and manage only their own store's coupons.
create policy "staff read own coupons" on coupons for select
  using (exists (select 1 from store_members m where m.store_id = coupons.store_id and m.user_id = auth.uid()));
create policy "staff write own coupons" on coupons for all
  using (exists (select 1 from store_members m where m.store_id = coupons.store_id and m.user_id = auth.uid()))
  with check (exists (select 1 from store_members m where m.store_id = coupons.store_id and m.user_id = auth.uid()));
create policy "staff see own membership" on store_members for select using (user_id = auth.uid());

-- Shoppers manage only their own wallet.
create policy "own wallet" on saved_coupons for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
