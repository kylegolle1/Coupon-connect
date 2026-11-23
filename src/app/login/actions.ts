"use server";

import { headers } from "next/headers";
import { getAuthClient } from "@/lib/supabase-server";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

/** Emails the shopper a one-tap sign-in link (no password). */
export async function sendSignInLink(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  const client = await getAuthClient();
  if (!client) return { status: "error", message: "Sign-in isn't set up yet." };
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { status: "error", message: "We couldn't send the email. Please try again in a minute." };
  return { status: "sent", message: email };
}
