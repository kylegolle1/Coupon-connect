import { describe, expect, it } from "vitest";
import { getPromoCodes, getStores } from "../data";

describe("stores (sample mode)", () => {
  it("real chains link to the store's own coupon page over https", async () => {
    const real = (await getStores()).filter((s) => !s.isDemo);
    expect(real.length).toBeGreaterThan(0);
    for (const s of real) expect(s.couponsUrl, s.name).toMatch(/^https:\/\//);
  });
  it("never invents promo codes: none without a licensed feed", async () => {
    expect(await getPromoCodes("kroger")).toEqual([]);
  });
});
