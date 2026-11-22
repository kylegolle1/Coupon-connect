export type BarcodeFormat = "upca" | "ean13" | "code128" | "databarexpanded" | "qrcode";

export interface Store {
  id: string;
  name: string;
  color: string;
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
