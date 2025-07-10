"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/lib/trpc/client";
import { SiteHeader } from "@/modules/dashboard/ui/components/site-header";
import type { ProfileData } from "@/modules/profile/types";

import { ProfileForm } from "../components/profile-form";

export function ProfileView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.profile.get.queryOptions());

  return (
    <>
      <SiteHeader title="Profile" />
      <div className="p-4 lg:p-6">
        <ProfileForm profile={data as ProfileData} />
      </div>
    </>
  );
}

export function ProfileViewSkeleton() {
  return <LoadingState description="Please wait while we load your profile." title="Loading profile" />;
}

export function ProfileViewError() {
  return <ErrorState description="Something went wrong. Please try again later." title="Error loading profile" />;
}
