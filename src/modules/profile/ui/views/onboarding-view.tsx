"use client";

import { Logo } from "@/components/logo";
import type { Session } from "@/lib/auth";
import { OnboardingForm } from "@/modules/profile/ui/components/onboarding/onboarding-form";

interface OnboardingViewProps {
  session: Session;
}

export function OnboardingView({ session }: OnboardingViewProps) {
  return (
    <main className="bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-center">
          <Logo className="mb-4" />
        </div>
        <OnboardingForm user={session.user} />
      </div>
    </main>
  );
}
