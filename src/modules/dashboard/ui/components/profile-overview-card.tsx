import { IconEdit, IconTarget } from "@tabler/icons-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileGet } from "@/modules/profile/types";
import { ACTIVITY_LEVELS_INFO, DIET_TYPE_INFO, GOAL_INFO } from "@/modules/profile/utils/constants";

interface ProfileOverviewCardProps {
  profile: ProfileGet;
}

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Profile Setup</CardTitle>
          <CardDescription>Complete your profile to get personalized nutrition targets</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/onboarding">
              <IconEdit className="mr-2 size-4" />
              Complete Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Your Profile</CardTitle>
        <CardDescription>Your nutrition targets and preferences</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {profile.goal && (
                <Badge variant="outline">{GOAL_INFO[profile.goal as keyof typeof GOAL_INFO].text}</Badge>
              )}
              {profile.dietType && (
                <Badge variant="secondary">
                  {DIET_TYPE_INFO[profile.dietType as keyof typeof DIET_TYPE_INFO]?.text}
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground text-sm">
              {profile.weight ? `${profile.weight.value} ${profile.weight.unit}` : "Weight not set"} •{" "}
              {ACTIVITY_LEVELS_INFO[profile.activityLevel as keyof typeof ACTIVITY_LEVELS_INFO].title || ""}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="flex items-center gap-1 font-medium text-sm">
              <IconTarget className="size-4" />
              Daily Targets
            </h4>
            <div className="grid grid-cols-4 gap-3 lg:grid-cols-2">
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-calories" />
                <span className="font-medium text-calories-foreground text-sm">
                  {profile.calories ? Math.round(profile.calories) : 0}
                </span>
                <span className="text-muted-foreground text-xs">kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-protein" />
                <span className="font-medium text-protein-foreground text-sm">
                  {profile.protein ? Math.round(profile.protein) : 0}g
                </span>
                <span className="text-muted-foreground text-xs">protein</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-carbs" />
                <span className="font-medium text-carbs-foreground text-sm">
                  {profile.carbs ? Math.round(profile.carbs) : 0}g
                </span>
                <span className="text-muted-foreground text-xs">carbs</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-fat" />
                <span className="font-medium text-fat-foreground text-sm">
                  {profile.fat ? Math.round(profile.fat) : 0}g
                </span>
                <span className="text-muted-foreground text-xs">fat</span>
              </div>
            </div>
          </div>
        </div>
        <Link href="/profile">
          <Button className="w-full" size="sm" variant="outline">
            <IconEdit className="mr-2 size-4" />
            Edit Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
