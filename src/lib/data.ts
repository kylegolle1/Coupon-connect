import { activeCoupons } from "./coupons";
import { STORES, sampleCoupons } from "./sample-data";
import { getSupabase } from "./supabase";
import type { BarcodeFormat, Coupon, Store } from "./types";

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

export async function getStores(): Promise<Store[]> {
  const db = getSupabase();
  if (!db) return STORES;
  const { data, error } = await db.from("stores").select("id, name, color").order("name");
  if (error) throw new Error(`Could not load stores: ${error.message}`);
  return data ?? [];
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
