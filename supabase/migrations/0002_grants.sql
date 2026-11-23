-- Let the app's public key read live stores and coupons. Row rules (in 0001) still decide which rows.
grant usage on schema public to anon, authenticated;
grant select on public.stores, public.coupons to anon, authenticated;
grant insert, update, delete on public.coupons to authenticated;
grant select on public.store_members to authenticated;
grant select, insert, delete on public.saved_coupons to authenticated;
