import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["600", "800"] });

export const metadata: Metadata = {
  title: "Coupon Connect",
  description: "Coupons from your favourite stores, ready to scan at checkout.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffcb2f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bricolage.variable} font-sans antialiased`}>
        <div className="mx-auto min-h-screen max-w-[480px]">
          <header className="sticky top-0 z-10 border-b border-line bg-surface px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-display text-[22px] font-extrabold tracking-tight">
              <span className="grid h-7 w-7 -rotate-6 place-items-center rounded-md bg-accent text-[15px] text-accent-ink" aria-hidden>
                %
              </span>
              Coupon Connect
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
