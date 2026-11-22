import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold">This coupon isn&apos;t available</h1>
      <p className="text-muted">It may have expired or been removed by the store.</p>
      <Link href="/" className="rounded-xl bg-accent px-4 py-3 font-semibold text-accent-ink">
        See current coupons
      </Link>
    </main>
  );
}
