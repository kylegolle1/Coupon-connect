import Link from "next/link";
import { expiryLabel, daysLeft } from "@/lib/coupons";
import { getActiveCoupons } from "@/lib/data";
import { STORES, storeById } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const { store } = await searchParams;
  const selected = store && storeById(store) ? store : undefined;
  const coupons = await getActiveCoupons(selected);

  return (
    <main className="flex flex-col gap-4 px-4 pb-12 pt-4">
      <p className="rounded-lg border border-dashed border-line bg-surface-2 px-3 py-2 text-[13px] text-muted">
        <b className="text-ink">Early version.</b> Stores and coupons are made-up examples.
      </p>

      <nav aria-label="Filter by store" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <StoreChip href="/" label="All stores" active={!selected} />
        {STORES.map((s) => (
          <StoreChip key={s.id} href={`/?store=${s.id}`} label={s.name} active={selected === s.id} />
        ))}
      </nav>

      <h1 className="font-display text-lg font-semibold">
        {selected ? storeById(selected)!.name : "All coupons"} · {coupons.length}
      </h1>

      {coupons.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface p-7 text-center text-muted">
          No coupons right now. Check back soon.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {coupons.map((c) => {
            const s = storeById(c.storeId)!;
            const soon = daysLeft(c) <= 3;
            return (
              <li key={c.id}>
                <Link
                  href={`/coupon/${c.id}`}
                  className="grid min-h-[44px] grid-cols-[1fr_auto] overflow-hidden rounded-2xl bg-surface shadow-sm"
                >
                  <div className="flex min-w-0 flex-col gap-1.5 p-4">
                    <span className="flex items-center gap-2 text-[13px] font-semibold text-muted">
                      <span className="grid h-[22px] w-[22px] place-items-center rounded-md text-[11px] font-bold text-white" style={{ background: s.color }}>
                        {s.name[0]}
                      </span>
                      {s.name}
                    </span>
                    <span className="font-display text-[26px] font-extrabold leading-none tracking-tight">{c.value}</span>
                    <span className="text-[15px]">{c.title}</span>
                    <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${soon ? "bg-warn-soft text-warn" : "bg-surface-2 text-muted"}`}>
                      {expiryLabel(c)}
                    </span>
                  </div>
                  <div className="flex w-20 flex-col items-center justify-center gap-1.5 border-l-2 border-dashed border-line bg-surface-2 px-1.5 text-center text-[11px] font-semibold text-brand">
                    Tap to scan
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function StoreChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[44px] flex-none items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium ${
        active ? "border-ink bg-ink text-surface" : "border-line bg-surface"
      }`}
    >
      {label}
    </Link>
  );
}
