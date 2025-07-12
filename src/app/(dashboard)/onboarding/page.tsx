import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { OnboardingView } from "@/modules/profile/ui/views/onboarding-view";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.onboardingComplete) {
    redirect("/dashboard");
  }

  return <OnboardingView session={session} />;
}
