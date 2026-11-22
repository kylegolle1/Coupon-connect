import type { Coupon } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** A coupon is shown to shoppers only between its start and end time. */
export function isActive(coupon: Coupon, now: Date = new Date()): boolean {
  const t = now.getTime();
  return Date.parse(coupon.startsAt) <= t && t < Date.parse(coupon.endsAt);
}

/** Active coupons, ending soonest first. Expired and not-yet-started coupons are removed. */
export function activeCoupons(coupons: Coupon[], now: Date = new Date()): Coupon[] {
  return coupons
    .filter((c) => isActive(c, now))
    .sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt));
}

/** Whole days left before a coupon ends (0 = ends today/within 24h). */
export function daysLeft(coupon: Coupon, now: Date = new Date()): number {
  return Math.max(0, Math.floor((Date.parse(coupon.endsAt) - now.getTime()) / DAY_MS));
}

/** Plain-English expiry label, e.g. "Ends today", "Ends in 2 days". */
export function expiryLabel(coupon: Coupon, now: Date = new Date()): string {
  if (!isActive(coupon, now)) return "Expired";
  const d = daysLeft(coupon, now);
  if (d === 0) return "Ends today";
  if (d <= 3) return `Ends in ${d} day${d === 1 ? "" : "s"}`;
  return `Ends ${new Date(coupon.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`;
}
