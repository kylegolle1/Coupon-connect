import { redirect } from "next/navigation";
import { getSignedInEmail, isAuthEnabled } from "@/lib/supabase-server";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isAuthEnabled() || (await getSignedInEmail())) redirect("/");
  return (
    <main className="flex flex-col gap-4 px-5 pb-12 pt-7">
      <h1 className="font-display text-[30px] font-extrabold leading-tight">Welcome</h1>
      <p className="text-[15px] text-muted">Sign in to see coupons from your stores.</p>
      <LoginForm />
    </main>
  );
}
