"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold">Coupons can&apos;t load right now</h1>
      <p className="text-muted">Check your connection and try again. Saved coupons will still work offline soon.</p>
      <button type="button" onClick={reset} className="min-h-[44px] rounded-xl bg-accent px-4 py-3 font-semibold text-accent-ink">
        Try again
      </button>
    </main>
  );
}
