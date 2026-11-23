import { activeCoupons } from "./coupons";
import { REAL_STORES, STORES, sampleCoupons } from "./sample-data";
import { getSupabase } from "./supabase";
import type { BarcodeFormat, Coupon, PromoCode, Store } from "./types";

/**
 * Where the app gets stores and coupons. Uses the Supabase database when it is
 * configured (.env.local), otherwise the built-in sample data.
 * Expired coupons are filtered here on the server, and again by the database rules.
 */

interface CouponRow {
  id: string;
  store_id: string;
  value: string;
  title: string;
  category: string;
  barcode_value: string;
  barcode_format: BarcodeFormat;
  starts_at: string;
  ends_at: string;
  terms: string;
}

function fromRow(r: CouponRow): Coupon {
  return {
    id: r.id,
    storeId: r.store_id,
    value: r.value,
    title: r.title,
    category: r.category,
    barcodeValue: r.barcode_value,
    barcodeFormat: r.barcode_format,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    terms: r.terms,
  };
}

/** Demo (made-up) stores are hidden unless NEXT_PUBLIC_SHOW_DEMO=1, or in sample mode. */
function showDemo(sampleMode: boolean): boolean {
  return sampleMode || process.env.NEXT_PUBLIC_SHOW_DEMO === "1";
}

export async function getStores(): Promise<Store[]> {
  const db = getSupabase();
  if (!db) return [...REAL_STORES, ...STORES].filter((s) => !s.isDemo || showDemo(true));
  type Row = { id: string; name: string; color: string; coupons_url?: string | null; is_demo?: boolean };
  let res: { data: Row[] | null; error: { code?: string; message: string } | null } = await db
    .from("stores")
    .select("id, name, color, coupons_url, is_demo")
    .order("name");
  if (res.error?.code === "42703") {
    // Database not yet updated with migration 0004: fall back to the original columns.
    res = await db.from("stores").select("id, name, color").order("name");
  }
  const { data, error } = res;
  if (error) throw new Error(`Could not load stores: ${error.message}`);
  return (data ?? [])
    .map((r) => ({ id: r.id, name: r.name, color: r.color, couponsUrl: r.coupons_url, isDemo: r.is_demo }))
    .filter((s) => !s.isDemo || showDemo(false));
}

/** Live online promo codes for a store (empty until a licensed feed is connected). */
export async function getPromoCodes(storeId: string): Promise<PromoCode[]> {
  const db = getSupabase();
  if (!db) return [];
  const now = new Date().toISOString();
  const { data, error } = await db
    .from("promo_codes")
    .select("id, store_id, title, code, url, ends_at")
    .eq("store_id", storeId)
    .lte("starts_at", now)
    .gt("ends_at", now)
    .order("ends_at");
  // The table only exists once migration 0004 has run; until then, show no codes rather than fail.
  if (error) return [];
  return (data ?? []).map((r) => ({ id: r.id, storeId: r.store_id, title: r.title, code: r.code, url: r.url, endsAt: r.ends_at }));
}

export async function getActiveCoupons(storeId?: string): Promise<Coupon[]> {
  const db = getSupabase();
  if (!db) {
    const all = activeCoupons(sampleCoupons());
    return storeId ? all.filter((c) => c.storeId === storeId) : all;
  }
  const now = new Date().toISOString();
  let query = db
    .from("coupons")
    .select("id, store_id, value, title, category, barcode_value, barcode_format, starts_at, ends_at, terms")
    .lte("starts_at", now)
    .gt("ends_at", now);
  if (storeId) query = query.eq("store_id", storeId);
  const { data, error } = await query;
  if (error) throw new Error(`Could not load coupons: ${error.message}`);
  return activeCoupons((data ?? []).map(fromRow));
}

export async function getActiveCoupon(id: string): Promise<Coupon | undefined> {
  const db = getSupabase();
  if (!db) return (await getActiveCoupons()).find((c) => c.id === id);
  // Only real ids reach the database; anything else is simply "not found".
  if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
  const now = new Date().toISOString();
  const { data, error } = await db
    .from("coupons")
    .select("id, store_id, value, title, category, barcode_value, barcode_format, starts_at, ends_at, terms")
    .eq("id", id)
    .lte("starts_at", now)
    .gt("ends_at", now)
    .maybeSingle();
  if (error) throw new Error(`Could not load coupon: ${error.message}`);
  return data ? activeCoupons([fromRow(data)])[0] : undefined;
}
