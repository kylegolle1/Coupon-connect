"use client";

import { useState } from "react";

/** Shows an online promo code with a big Copy button. */
export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked: the code is still visible to type in.
        }
      }}
      className="flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface-2 px-3 font-mono text-base font-semibold"
      aria-label={`Copy code ${code}`}
    >
      {code}
      <span className="font-sans text-sm text-brand">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}
