import { NextResponse, type NextRequest } from "next/server";
import { getAuthClient } from "@/lib/supabase-server";

/** The link in the sign-in email lands here; we swap its one-time code for a session. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const client = await getAuthClient();
  if (code && client) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
