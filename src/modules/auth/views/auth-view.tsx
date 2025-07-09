"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";

import { Logo } from "@/components/logo";

export function AuthView({ pathname }: { pathname: string }) {
  return (
    <main className="container flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <Logo />
      <AuthCard
        classNames={{
          footerLink: "text-muted-foreground",
          form: {
            input: "placeholder:text-foreground/80",
          },
        }}
        pathname={pathname}
      />
    </main>
  );
}
