"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type * as React from "react";

import { authClient } from "@/lib/auth/auth-client";
import { env } from "@/lib/env";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      Link={Link}
      navigate={router.push}
      onSessionChange={() => router.refresh()}
      redirectTo={`${env.NEXT_PUBLIC_APP_URL}/dashboard`}
      replace={router.replace}
      social={{ providers: ["google", "github"] }}
    >
      {children}
    </AuthUIProvider>
  );
}
