import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AuthView } from "@/modules/auth/views/auth-view";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((pathname) => ({ pathname }));
}

export default async function AuthPage({ params }: { params: Promise<{ pathname: string }> }) {
  const { pathname } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && pathname !== authViewPaths.SETTINGS) {
    redirect("/dashboard");
  }

  return <AuthView pathname={pathname} />;
}
