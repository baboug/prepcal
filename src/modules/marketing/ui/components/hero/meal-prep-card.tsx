import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MealPrepCard() {
  return (
    <Card className="h-full flex-1 border-muted">
      <CardHeader>
        <CardTitle className="text-xl">Streamline your meal prep</CardTitle>
        <CardDescription>Plan your meals, grocery shopping, and cooking in seconds using AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video rounded-lg">
          <Image alt="Streamline your meal prep" className="rounded-lg object-cover" fill src="/hero/meal-prep.jpg" />
        </div>
      </CardContent>
    </Card>
  );
}
