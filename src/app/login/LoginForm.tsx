"use client";

import { useActionState } from "react";
import { sendSignInLink, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-surface p-5" role="status">
        <b className="text-lg">Check your email</b>
        <p className="text-[15px] text-muted">
          We sent a sign-in link to <b className="text-ink">{state.message}</b>. Tap it on this phone to open your coupons.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          className="min-h-[48px] rounded-xl border border-line bg-surface px-3.5 text-base font-normal"
        />
      </label>
      {state.status === "error" && (
        <p className="text-sm font-semibold text-[#b52a24]" role="alert">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-[54px] rounded-2xl bg-accent text-[17px] font-bold text-accent-ink disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
      <p className="text-center text-[13px] text-muted">No password to remember. Tap the link in your email to sign in.</p>
    </form>
  );
}
