import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold">This page isn&apos;t available</h1>
      <p className="text-muted">The coupon may have expired, or the store removed it.</p>
      <Link href="/" className="rounded-xl bg-accent px-4 py-3 font-semibold text-accent-ink">
        See current coupons
      </Link>
    </main>
  );
}
