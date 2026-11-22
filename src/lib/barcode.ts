import type { BarcodeFormat } from "./types";

/** Human-friendly names for each barcode format, shown to store staff. */
export const BARCODE_FORMAT_LABELS: Record<BarcodeFormat, string> = {
  upca: "UPC-A (12 digits)",
  ean13: "EAN-13 (13 digits)",
  code128: "Code 128 (letters and numbers)",
  databarexpanded: "GS1 DataBar Expanded (US manufacturer coupons)",
  qrcode: "QR code",
};

/** GS1 check digit for the digits before the check digit (works for UPC-A and EAN-13). */
export function gs1CheckDigit(body: string): number {
  let sum = 0;
  // Weights alternate 3,1,3,1... starting from the rightmost body digit.
  for (let i = 0; i < body.length; i++) {
    const digit = Number(body[body.length - 1 - i]);
    sum += digit * (i % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10;
}

/** Returns null if the value is valid for the format, otherwise a plain-English problem. */
export function validateBarcode(value: string, format: BarcodeFormat): string | null {
  if (!value) return "Enter the barcode number.";
  switch (format) {
    case "upca":
    case "ean13": {
      const len = format === "upca" ? 12 : 13;
      if (!/^\d+$/.test(value)) return "This barcode type only uses numbers.";
      if (value.length !== len) return `This barcode type needs exactly ${len} digits.`;
      const expected = gs1CheckDigit(value.slice(0, -1));
      if (Number(value.at(-1)) !== expected)
        return `The last digit should be ${expected}. Check the number was typed correctly.`;
      return null;
    }
    case "code128":
      if (value.length > 48) return "Code 128 barcodes should be 48 characters or fewer.";
      if (!/^[\x20-\x7E]+$/.test(value)) return "Use only standard letters, numbers and symbols.";
      return null;
    case "databarexpanded":
      if (!/^(\(\d{2,4}\)[^()]+)+$/.test(value))
        return "DataBar values use GS1 format, e.g. (8110)1234567890123.";
      return null;
    case "qrcode":
      if (value.length > 500) return "QR codes should be 500 characters or fewer.";
      return null;
  }
}

/** Options for bwip-js. Kept here so the screen and the tests draw barcodes the same way. */
export function bwipOptions(value: string, format: BarcodeFormat) {
  const base = {
    bcid: format,
    text: value,
    scale: 3,
    paddingwidth: 10,
    paddingheight: 10,
    backgroundcolor: "FFFFFF",
    barcolor: "000000",
  };
  if (format === "qrcode") return base;
  if (format === "databarexpanded") return { ...base, height: 20, parsefnc: true };
  return { ...base, height: 22, includetext: false };
}
