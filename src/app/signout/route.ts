import { NextResponse, type NextRequest } from "next/server";
import { getAuthClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const client = await getAuthClient();
  await client?.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}
