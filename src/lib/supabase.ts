import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/**
 * Returns a Supabase client when the project URL and public (anon) key are set in
 * .env.local, otherwise null so the app falls back to sample data.
 */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
