import { describe, expect, it } from "vitest";
import { activeCoupons, expiryLabel, isActive } from "../coupons";
import { sampleCoupons } from "../sample-data";
import type { Coupon } from "../types";

const now = new Date("2026-11-22T12:00:00Z");

function coupon(startsAt: string, endsAt: string): Coupon {
  return {
    id: "t", storeId: "greenleaf", value: "$1 off", title: "Test", category: "Pantry",
    barcodeValue: "TEST", barcodeFormat: "code128", startsAt, endsAt, terms: "",
  };
}

describe("isActive", () => {
  it("shows a coupon between its start and end", () => {
    expect(isActive(coupon("2026-11-20T00:00:00Z", "2026-11-25T00:00:00Z"), now)).toBe(true);
  });
  it("hides an expired coupon", () => {
    expect(isActive(coupon("2026-11-01T00:00:00Z", "2026-11-22T11:59:59Z"), now)).toBe(false);
  });
  it("hides a coupon at the exact moment it ends", () => {
    expect(isActive(coupon("2026-11-01T00:00:00Z", "2026-11-22T12:00:00Z"), now)).toBe(false);
  });
  it("hides a coupon that has not started yet", () => {
    expect(isActive(coupon("2026-11-23T00:00:00Z", "2026-11-30T00:00:00Z"), now)).toBe(false);
  });
});

describe("activeCoupons", () => {
  it("removes expired and future sample coupons and sorts ending soonest first", () => {
    const list = activeCoupons(sampleCoupons(now), now);
    const ids = list.map((c) => c.id);
    expect(ids).not.toContain("c8"); // expired
    expect(ids).not.toContain("c9"); // not started
    const ends = list.map((c) => Date.parse(c.endsAt));
    expect([...ends].sort((a, b) => a - b)).toEqual(ends);
  });
});

describe("expiryLabel", () => {
  it("uses plain words", () => {
    expect(expiryLabel(coupon("2026-11-20T00:00:00Z", "2026-11-22T20:00:00Z"), now)).toBe("Ends today");
    expect(expiryLabel(coupon("2026-11-20T00:00:00Z", "2026-11-24T13:00:00Z"), now)).toBe("Ends in 2 days");
    expect(expiryLabel(coupon("2026-11-20T00:00:00Z", "2026-12-10T00:00:00Z"), now)).toBe("Ends Dec 10");
  });
});
