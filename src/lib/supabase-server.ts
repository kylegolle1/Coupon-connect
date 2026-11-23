import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

/** Sign-in is switched on only when the Supabase project is configured. */
export function isAuthEnabled(): boolean {
  return env() !== null;
}

/** A Supabase client that knows who is signed in (reads/writes the session cookie). */
export async function getAuthClient() {
  const e = env();
  if (!e) return null;
  const store = await cookies();
  return createServerClient(e.url, e.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a page render, where cookies are read-only. The middleware refreshes them.
        }
      },
    },
  });
}

export async function getSignedInEmail(): Promise<string | null> {
  const client = await getAuthClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data.user?.email ?? null;
}
