import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function BillingSuccessPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment successful</CardTitle>
          <CardDescription>Your subscription is being activated. This may take a few seconds.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Link href="/billing">
            <Button asChild type="button">
              Go to Billing
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button asChild type="button" variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
