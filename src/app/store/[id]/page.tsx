import Link from "next/link";
import { notFound } from "next/navigation";
import { expiryLabel } from "@/lib/coupons";
import { getActiveCoupons, getStores } from "@/lib/data";

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
  const all = await getActiveCoupons(store.id);
  const shown = query
    ? all.filter((c) => `${c.title} ${c.category}`.toLowerCase().includes(query))
    : [...all].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="flex flex-col gap-3 px-4 pb-12 pt-4">
      <Link href="/" className="flex min-h-[44px] w-fit items-center text-base font-semibold text-brand">
        ‹ Stores
      </Link>
      <h1 className="font-display text-[26px] font-extrabold leading-tight">What are you buying at {store.name}?</h1>

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

      {shown.length === 0 ? (
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
    </main>
  );
}
