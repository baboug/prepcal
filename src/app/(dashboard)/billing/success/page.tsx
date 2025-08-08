import { headers } from "next/headers";
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
          <Button asChild type="button">
            <a href="/billing">Go to Billing</a>
          </Button>
          <Button asChild type="button" variant="outline">
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
