import Link from "next/link";
import { notFound } from "next/navigation";
import { expiryLabel } from "@/lib/coupons";
import { getActiveCoupons, getPromoCodes, getStores } from "@/lib/data";
import CopyCode from "./CopyCode";

export const dynamic = "force-dynamic";

/** Step 2: what are you buying here? Tap an item to get its barcode. */
export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const { q = "" } = await searchParams;
  const store = (await getStores()).find((s) => s.id === id);
  if (!store) notFound();

  const query = q.trim().toLowerCase();
  const [all, promos] = await Promise.all([getActiveCoupons(store.id), getPromoCodes(store.id)]);
  const hasOtherWays = Boolean(store.couponsUrl) || promos.length > 0;
  const shown = query
    ? all.filter((c) => `${c.title} ${c.category}`.toLowerCase().includes(query))
    : [...all].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="flex flex-col gap-3 px-4 pb-12 pt-4">
      <Link href="/" className="flex min-h-[44px] w-fit items-center text-base font-semibold text-brand">
        ‹ Stores
      </Link>
      <h1 className="font-display text-[26px] font-extrabold leading-tight">What are you buying at {store.name}?</h1>

      {store.couponsUrl && (
        <a
          href={store.couponsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-surface"
        >
          <span className="flex flex-col gap-0.5">
            <b className="text-base">Get {store.name}&apos;s digital coupons</b>
            <span className="text-[13px] opacity-80">Opens {store.name}&apos;s own app or website, where you add them to your card</span>
          </span>
          <span aria-hidden className="text-xl">↗</span>
        </a>
      )}

      {promos.length > 0 && (
        <section aria-labelledby="online-codes" className="flex flex-col gap-2.5">
          <h2 id="online-codes" className="text-lg font-bold">
            Codes for shopping online
          </h2>
          <ul className="flex flex-col gap-2.5">
            {promos.map((p) => (
              <li key={p.id} className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
                <span className="text-base font-semibold">{p.title}</span>
                <span className="flex flex-wrap items-center gap-2">
                  {p.code ? <CopyCode code={p.code} /> : <span className="text-sm text-muted">No code needed</span>}
                  <a href={p.url} target="_blank" rel="noopener noreferrer sponsored" className="min-h-[44px] content-center px-1 text-sm font-semibold text-brand">
                    Shop online ↗
                  </a>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">We may earn a small commission when you shop through these links.</p>
        </section>
      )}

      {(all.length > 0 || !hasOtherWays) && (
        <h2 className="pt-1 text-lg font-bold">Scan at the register</h2>
      )}

      {all.length > 0 && (
        <form role="search" className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <label htmlFor="q" className="sr-only">
            Search items
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search milk, bread, eggs…" className="min-h-[48px] w-full bg-transparent outline-none" />
        </form>
      )}


      {all.length === 0 && hasOtherWays ? null : shown.length === 0 ? (
        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-5" role="status">
          <b className="text-lg">{query ? `No discount on “${q.trim()}” right now` : "No discounts here right now"}</b>
          <span className="text-[15px] text-muted">We&apos;ll show it here as soon as {store.name} posts one.</span>
          {query && (
            <Link href={`/store/${store.id}`} className="mt-1 font-semibold text-brand">
              See all discounted items
            </Link>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {shown.map((c) => (
            <li key={c.id}>
              <Link href={`/coupon/${c.id}`} className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3">
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold">{c.title}</span>
                  <span className="text-[13px] text-muted">{expiryLabel(c)}</span>
                </span>
                <span className="flex-none rounded-full bg-[#dcf2e6] px-2.5 py-1 text-[13px] font-bold text-[#0d5c38]">{c.value}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="pt-2 text-xs text-muted">
        Coupon Connect is independent and isn&apos;t affiliated with or endorsed by {store.name}.
      </p>
    </main>
  );
}
