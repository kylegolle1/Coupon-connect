import { describe, expect, it } from "vitest";
import bwipjs from "bwip-js/node";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import {
  BarcodeFormat as ZxFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  RGBLuminanceSource,
} from "@zxing/library";
import { bwipOptions, gs1CheckDigit, validateBarcode } from "../barcode";
import { sampleCoupons } from "../sample-data";
import type { BarcodeFormat } from "../types";

async function renderAndDecode(value: string, format: BarcodeFormat): Promise<string> {
  const png = PNG.sync.read(await bwipjs.toBuffer(bwipOptions(value, format)));
  // QR codes are checked with jsQR (the same kind of camera decoder phones use); 1D barcodes with ZXing.
  if (format === "qrcode") {
    const qr = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    if (!qr) throw new Error("QR code could not be read");
    return qr.data;
  }
  const lum = new Uint8ClampedArray(png.width * png.height);
  for (let i = 0; i < lum.length; i++) {
    const o = i * 4;
    lum[i] = (png.data[o] * 299 + png.data[o + 1] * 587 + png.data[o + 2] * 114) / 1000;
  }
  const reader = new MultiFormatReader();
  const hints = new Map();
  hints.set(DecodeHintType.TRY_HARDER, true);
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    ZxFormat.UPC_A, ZxFormat.EAN_13, ZxFormat.CODE_128, ZxFormat.RSS_EXPANDED,
  ]);
  reader.setHints(hints);
  const result = reader.decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(lum, png.width, png.height))));
  return result.getText();
}

describe("barcode validation", () => {
  it("computes GS1 check digits", () => {
    expect(gs1CheckDigit("03600029145")).toBe(2);
    expect(gs1CheckDigit("400638133393")).toBe(1);
  });
  it("accepts valid and rejects mistyped UPC-A / EAN-13", () => {
    expect(validateBarcode("036000291452", "upca")).toBeNull();
    expect(validateBarcode("036000291453", "upca")).toMatch(/last digit should be 2/);
    expect(validateBarcode("4006381333931", "ean13")).toBeNull();
    expect(validateBarcode("40063813339", "ean13")).toMatch(/13 digits/);
    expect(validateBarcode("12AB", "upca")).toMatch(/only uses numbers/);
  });
  it("checks every sample coupon has a valid barcode", () => {
    for (const c of sampleCoupons()) expect(validateBarcode(c.barcodeValue, c.barcodeFormat), c.id).toBeNull();
  });
});

describe("barcodes actually scan", () => {
  const cases: Array<[string, BarcodeFormat]> = [
    ["036000291452", "upca"],
    ["4006381333931", "ean13"],
    ["CC-NORTHSIDE-5OFF50", "code128"],
    ["CC-NORTHSIDE-5OFF50", "qrcode"],
  ];
  for (const [value, format] of cases) {
    it(`${format} decodes back to ${value}`, async () => {
      const text = await renderAndDecode(value, format);
      // ZXing reports UPC-A as its 12 digits; EAN-13 as 13.
      expect(text).toBe(value);
    });
  }
  it("every sample coupon scans back to its stored value", async () => {
    for (const c of sampleCoupons()) {
      expect(await renderAndDecode(c.barcodeValue, c.barcodeFormat), c.id).toBe(c.barcodeValue);
    }
  });
});
