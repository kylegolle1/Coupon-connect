import Link from "next/link";
import { notFound } from "next/navigation";
import bwipjs from "bwip-js/node";
import { bwipOptions } from "@/lib/barcode";
import { expiryLabel } from "@/lib/coupons";
import { getActiveCoupon } from "@/lib/data";
import { storeById } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export default async function CouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await getActiveCoupon(id);
  // Expired or unknown coupons are treated as not found, so they can never be scanned.
  if (!coupon) notFound();
  const store = storeById(coupon.storeId)!;
  const svg = bwipjs.toSVG(bwipOptions(coupon.barcodeValue, coupon.barcodeFormat));

  return (
    <main className="flex flex-col gap-4 px-4 pb-12 pt-4">
      <Link href="/" className="flex min-h-[44px] w-fit items-center text-sm font-semibold text-brand">
        ← All coupons
      </Link>
      <p className="text-[13px] font-semibold text-muted">{store.name}</p>
      <h1 className="font-display text-[32px] font-extrabold leading-none tracking-tight">{coupon.value}</h1>
      <p className="text-[15px]">{coupon.title}</p>

      <figure className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-black">
        <div
          role="img"
          aria-label={`Barcode for ${coupon.value} ${coupon.title}`}
          className="w-full [&>svg]:mx-auto [&>svg]:h-auto [&>svg]:max-h-60 [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <figcaption className="font-mono text-[15px] tracking-[0.12em]">{coupon.barcodeValue}</figcaption>
      </figure>
      <p className="text-center text-[13px] text-muted">
        Turn your screen brightness up and hold the phone flat under the scanner.
      </p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px] text-muted">
        <dt className="font-semibold text-ink">Valid</dt>
        <dd>{expiryLabel(coupon)}</dd>
        <dt className="font-semibold text-ink">Terms</dt>
        <dd>{coupon.terms}</dd>
      </dl>
    </main>
  );
}
