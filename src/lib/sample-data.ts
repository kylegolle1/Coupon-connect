import type { Coupon, Store } from "./types";

/**
 * Made-up stores and coupons used until the database is connected.
 * Dates are relative to "now" so the list always looks current.
 */
export const STORES: Store[] = [
  { id: "greenleaf", name: "Greenleaf Grocers", color: "#1d8a52" },
  { id: "pantry", name: "Corner Pantry", color: "#c2410c" },
  { id: "northside", name: "Northside Market", color: "#2149c9" },
  { id: "bright", name: "BrightHome Goods", color: "#7c3aed" },
  { id: "tandem", name: "Tandem Pharmacy", color: "#0e7490" },
].map((s) => ({ ...s, isDemo: true }));

/** Real chains: we only link to each store's own coupon page. */
export const REAL_STORES: Store[] = [
  { id: "kroger", name: "Kroger", color: "#1d4ed8", couponsUrl: "https://www.kroger.com/savings/cl/coupons/" },
  { id: "safeway", name: "Safeway", color: "#b91c1c", couponsUrl: "https://www.safeway.com/foru/coupons-deals.html" },
  { id: "target", name: "Target", color: "#be123c", couponsUrl: "https://www.target.com/circle" },
];

const DAY = 24 * 60 * 60 * 1000;

function rel(days: number, now: Date): string {
  return new Date(now.getTime() + days * DAY).toISOString();
}

export function sampleCoupons(now: Date = new Date()): Coupon[] {
  const rows: Array<[string, string, string, string, string, Coupon["barcodeFormat"], number, number, string]> = [
    ["c1", "greenleaf", "$1 off", "Any 2 lb bag of apples", "Produce", "upca", -3, 2, "One per customer"],
    ["c2", "greenleaf", "30% off", "Store-brand frozen vegetables", "Pantry", "code128", -1, 9, "Up to 4 bags"],
    ["c3", "pantry", "$2 off", "Any $10 meat purchase", "Meat", "ean13", -2, 5, "One per visit"],
    ["c4", "northside", "$0.75 off", "Half gallon of milk", "Dairy & eggs", "code128", -5, 12, "One per customer"],
    ["c5", "northside", "$5 off", "Your order of $50 or more", "Pantry", "qrcode", -1, 20, "Excludes alcohol and gift cards"],
    ["c6", "bright", "20% off", "Laundry detergent, any size", "Household", "code128", -4, 7, "One per customer"],
    ["c7", "tandem", "$4 off", "Children's cold medicine", "Health", "code128", -2, 14, "One per customer"],
    // Expired and not-yet-started examples: these must never show to shoppers.
    ["c8", "greenleaf", "$1 off", "Pumpkin pie, 9 inch", "Pantry", "code128", -10, -2, "One per customer"],
    ["c9", "pantry", "Buy 1 get 1", "Corner Pantry pasta", "Pantry", "code128", 3, 10, "Limit 2 free"],
  ];
  const codes: Record<string, string> = {
    c1: "036000291452",
    c3: "4006381333931",
    c5: "CC-NORTHSIDE-5OFF50",
  };
  return rows.map(([id, storeId, value, title, category, barcodeFormat, start, end, terms]) => ({
    id,
    storeId,
    value,
    title,
    category,
    barcodeFormat,
    barcodeValue: codes[id] ?? `CC${id.toUpperCase()}${storeId.slice(0, 3).toUpperCase()}`,
    startsAt: rel(start, now),
    endsAt: rel(end, now),
    terms,
  }));
}

export function storeById(id: string): Store | undefined {
  return [...STORES, ...REAL_STORES].find((s) => s.id === id);
}
