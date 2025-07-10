"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NextStepsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border bg-muted/20 p-4 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 font-semibold text-green-600 text-lg dark:bg-green-900 dark:text-green-400">
              1
            </div>
            <h4 className="mb-2 font-semibold">Track Your Intake</h4>
            <p className="text-muted-foreground text-sm">Monitor your daily calories and macros</p>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-muted/20 p-4 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 font-semibold text-green-600 text-lg dark:bg-green-900 dark:text-green-400">
              2
            </div>
            <h4 className="mb-2 font-semibold">Plan Your Meals</h4>
            <p className="text-muted-foreground text-sm">Create meal plans that fit your macro targets and lifestyle</p>
          </div>
          <div className="flex flex-col items-center rounded-lg border bg-muted/20 p-4 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 font-semibold text-green-600 text-lg dark:bg-green-900 dark:text-green-400">
              3
            </div>
            <h4 className="mb-2 font-semibold">Monitor Progress</h4>
            <p className="text-muted-foreground text-sm">Weigh yourself regularly and adjust your plan as needed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
