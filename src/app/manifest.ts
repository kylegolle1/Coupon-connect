import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coupon Connect",
    short_name: "Coupons",
    description: "Coupons from your favourite stores, ready to scan at checkout.",
    start_url: "/",
    display: "standalone",
    background_color: "#e9edf4",
    theme_color: "#ffcb2f",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
