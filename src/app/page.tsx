import Link from "next/link";
import { getActiveCoupons, getStores } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Step 1 after signing in: pick the store you're shopping at. */
export default async function Home() {
  const [stores, coupons] = await Promise.all([getStores(), getActiveCoupons()]);
  const counts = new Map<string, number>();
  for (const c of coupons) counts.set(c.storeId, (counts.get(c.storeId) ?? 0) + 1);

  return (
    <main className="flex flex-col gap-3 px-4 pb-12 pt-5">
      <h1 className="font-display text-[28px] font-extrabold leading-tight">Pick a store</h1>
      {stores.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-surface p-7 text-center text-muted">No stores yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {stores.map((s) => {
            const n = counts.get(s.id) ?? 0;
            return (
              <li key={s.id}>
                <Link href={`/store/${s.id}`} className="flex min-h-[76px] items-center gap-3.5 rounded-2xl bg-surface px-4 py-3.5">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 flex-none place-items-center rounded-xl text-[19px] font-extrabold text-white"
                    style={{ background: s.color }}
                  >
                    {s.name[0]}
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <b className="text-[17px]">{s.name}</b>
                    <span className="text-sm text-muted">
                      {n > 0
                        ? `${n} item${n === 1 ? "" : "s"} to scan at the register`
                        : s.couponsUrl
                          ? "Opens the store's own coupons"
                          : "No discounts right now"}
                    </span>
                  </span>
                  <span aria-hidden className="text-[26px] text-brand">
                    ›
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
