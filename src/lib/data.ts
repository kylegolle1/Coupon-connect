import { activeCoupons } from "./coupons";
import { sampleCoupons } from "./sample-data";
import type { Coupon } from "./types";

/**
 * Where the app gets coupons. For now this is sample data; once Supabase is set up
 * (see supabase/migrations and .env.example) this will read from the database.
 * Filtering for expired coupons always happens here, on the server.
 */
export async function getActiveCoupons(storeId?: string): Promise<Coupon[]> {
  const all = activeCoupons(sampleCoupons());
  return storeId ? all.filter((c) => c.storeId === storeId) : all;
}

export async function getActiveCoupon(id: string): Promise<Coupon | undefined> {
  return (await getActiveCoupons()).find((c) => c.id === id);
}
