-- Fix: the store-staff rules were checked for every visitor, which blocked shoppers
-- from reading coupons. Limit them to signed-in users.
drop policy if exists "staff read own coupons" on coupons;
drop policy if exists "staff write own coupons" on coupons;
drop policy if exists "staff see own membership" on store_members;
drop policy if exists "own wallet" on saved_coupons;

create policy "staff read own coupons" on coupons for select to authenticated
  using (exists (select 1 from store_members m where m.store_id = coupons.store_id and m.user_id = auth.uid()));
create policy "staff write own coupons" on coupons for all to authenticated
  using (exists (select 1 from store_members m where m.store_id = coupons.store_id and m.user_id = auth.uid()))
  with check (exists (select 1 from store_members m where m.store_id = coupons.store_id and m.user_id = auth.uid()));
create policy "staff see own membership" on store_members for select to authenticated
  using (user_id = auth.uid());
create policy "own wallet" on saved_coupons for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Add the sample coupons only if the coupons table is still empty (safe to run more than once).
insert into coupons (store_id, value, title, category, barcode_value, barcode_format, starts_at, ends_at, terms)
select v.store_id::uuid, v.value, v.title, v.category, v.barcode_value, v.barcode_format::barcode_format, v.starts_at, v.ends_at, v.terms
from (values
('11111111-1111-4111-8111-111111111111', '$1 off', 'Any 2 lb bag of apples', 'Produce', '036000291452', 'upca', now() - interval '3 days', now() + interval '14 days', 'One per customer'),
  ('11111111-1111-4111-8111-111111111111', '30% off', 'Store-brand frozen vegetables', 'Pantry', 'CCGREENVEG30', 'code128', now() - interval '1 day', now() + interval '21 days', 'Up to 4 bags'),
  ('22222222-2222-4222-8222-222222222222', '$2 off', 'Any $10 meat purchase', 'Meat', '4006381333931', 'ean13', now() - interval '2 days', now() + interval '10 days', 'One per visit'),
  ('33333333-3333-4333-8333-333333333333', '$0.75 off', 'Half gallon of milk', 'Dairy & eggs', 'CCNORTHMILK075', 'code128', now() - interval '5 days', now() + interval '12 days', 'One per customer'),
  ('33333333-3333-4333-8333-333333333333', '$5 off', 'Your order of $50 or more', 'Pantry', 'CC-NORTHSIDE-5OFF50', 'qrcode', now() - interval '1 day', now() + interval '30 days', 'Excludes alcohol and gift cards'),
  ('44444444-4444-4444-8444-444444444444', '20% off', 'Laundry detergent, any size', 'Household', 'CCBRIGHTLAUNDRY20', 'code128', now() - interval '4 days', now() + interval '7 days', 'One per customer'),
  ('55555555-5555-4555-8555-555555555555', '$4 off', 'Children''s cold medicine', 'Health', 'CCTANDEMCOLD4', 'code128', now() - interval '2 days', now() + interval '14 days', 'One per customer'),
  ('11111111-1111-4111-8111-111111111111', '$1 off', 'Pumpkin pie, 9 inch', 'Pantry', 'CCGREENPIE1', 'code128', now() - interval '10 days', now() - interval '2 days', 'One per customer')
) as v(store_id, value, title, category, barcode_value, barcode_format, starts_at, ends_at, terms)
where not exists (select 1 from coupons);
