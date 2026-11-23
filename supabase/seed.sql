-- Sample stores and coupons so the app has something to show.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to skip for a real launch.
insert into stores (id, name, color) values
  ('11111111-1111-4111-8111-111111111111', 'Greenleaf Grocers', '#1d8a52'),
  ('22222222-2222-4222-8222-222222222222', 'Corner Pantry', '#c2410c'),
  ('33333333-3333-4333-8333-333333333333', 'Northside Market', '#2149c9'),
  ('44444444-4444-4444-8444-444444444444', 'BrightHome Goods', '#7c3aed'),
  ('55555555-5555-4555-8555-555555555555', 'Tandem Pharmacy', '#0e7490')
on conflict (id) do nothing;

insert into coupons (store_id, value, title, category, barcode_value, barcode_format, starts_at, ends_at, terms) values
  ('11111111-1111-4111-8111-111111111111', '$1 off', 'Any 2 lb bag of apples', 'Produce', '036000291452', 'upca', now() - interval '3 days', now() + interval '14 days', 'One per customer'),
  ('11111111-1111-4111-8111-111111111111', '30% off', 'Store-brand frozen vegetables', 'Pantry', 'CCGREENVEG30', 'code128', now() - interval '1 day', now() + interval '21 days', 'Up to 4 bags'),
  ('22222222-2222-4222-8222-222222222222', '$2 off', 'Any $10 meat purchase', 'Meat', '4006381333931', 'ean13', now() - interval '2 days', now() + interval '10 days', 'One per visit'),
  ('33333333-3333-4333-8333-333333333333', '$0.75 off', 'Half gallon of milk', 'Dairy & eggs', 'CCNORTHMILK075', 'code128', now() - interval '5 days', now() + interval '12 days', 'One per customer'),
  ('33333333-3333-4333-8333-333333333333', '$5 off', 'Your order of $50 or more', 'Pantry', 'CC-NORTHSIDE-5OFF50', 'qrcode', now() - interval '1 day', now() + interval '30 days', 'Excludes alcohol and gift cards'),
  ('44444444-4444-4444-8444-444444444444', '20% off', 'Laundry detergent, any size', 'Household', 'CCBRIGHTLAUNDRY20', 'code128', now() - interval '4 days', now() + interval '7 days', 'One per customer'),
  ('55555555-5555-4555-8555-555555555555', '$4 off', 'Children''s cold medicine', 'Health', 'CCTANDEMCOLD4', 'code128', now() - interval '2 days', now() + interval '14 days', 'One per customer'),
  -- Expired: must never appear in the app.
  ('11111111-1111-4111-8111-111111111111', '$1 off', 'Pumpkin pie, 9 inch', 'Pantry', 'CCGREENPIE1', 'code128', now() - interval '10 days', now() - interval '2 days', 'One per customer');
