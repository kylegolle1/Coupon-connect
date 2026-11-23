export type BarcodeFormat = "upca" | "ean13" | "code128" | "databarexpanded" | "qrcode";

export interface Store {
  id: string;
  name: string;
  color: string;
  /** The store's OWN coupon page or app link. We link to it; we never copy its coupons. */
  couponsUrl?: string | null;
  /** Made-up example store, hidden from shoppers unless demo mode is on. */
  isDemo?: boolean;
}

/** An online promo code from a licensed feed. Text and link only: never a barcode. */
export interface PromoCode {
  id: string;
  storeId: string;
  title: string;
  code: string | null;
  url: string;
  endsAt: string;
}

export interface Coupon {
  id: string;
  storeId: string;
  /** Short deal text, e.g. "$1 off" */
  value: string;
  /** What the coupon is for */
  title: string;
  category: string;
  barcodeValue: string;
  barcodeFormat: BarcodeFormat;
  /** ISO timestamps in UTC */
  startsAt: string;
  endsAt: string;
  terms: string;
}
