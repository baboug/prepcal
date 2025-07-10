"use client";

import { authClient } from "@/lib/auth/auth-client";
import { getUserFirstName } from "@/lib/utils";
import { ChartAreaInteractive } from "@/modules/dashboard/ui/components/chart-area-interactive";
import { DataTable } from "@/modules/dashboard/ui/components/data-table";
import { SectionCards } from "@/modules/dashboard/ui/components/section-cards";
import { SiteHeader } from "@/modules/dashboard/ui/components/site-header";
import data from "@/modules/dashboard/utils/data.json" with { type: "json" };

export function DashboardView() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return null;
  }

  return (
    <main>
      <SiteHeader title={`👋 Welcome back, ${getUserFirstName(session.user)}`} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </main>
  );
}
