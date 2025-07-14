"use client";

import { BananaIcon, DumbbellIcon, IceCreamConeIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UserTargets {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface NutritionOverviewCardProps {
  title: string;
  description: string;
  currentDayNutrition?: NutritionData;
  averageDailyNutrition: NutritionData;
  userTargets?: UserTargets | null;
  selectedDay?: number;
  showDayView?: boolean;
}

interface NutritionDisplayProps {
  label: string;
  current: number;
  target?: number;
  icon: React.ReactNode;
  colorClass: string;
}

function NutritionDisplay({ label, current, target, icon, colorClass }: NutritionDisplayProps) {
  const percentage = target ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="text-right">
          <div className="font-medium text-sm">
            {Math.round(current)}g
            {target && <span className="ml-1 text-muted-foreground text-xs">/ {Math.round(target)}g</span>}
            {target && <span className="ml-1 text-muted-foreground text-xs">({Math.round(percentage)}%)</span>}
          </div>
        </div>
      </div>
      {target && (
        <Progress className={cn("h-2", `${colorClass}/20`)} indicatorClassName={colorClass} value={percentage} />
      )}
    </div>
  );
}

export function NutritionOverviewCard({
  title,
  description,
  currentDayNutrition,
  averageDailyNutrition,
  userTargets,
  selectedDay,
  showDayView = false,
}: NutritionOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showDayView && currentDayNutrition && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">Day {selectedDay}</div>
              <div className="font-bold text-2xl">
                {Math.round(currentDayNutrition.calories)}
                {userTargets && (
                  <span className="ml-1">
                    / {Math.round(userTargets.calories || 0)}
                    <span className="text-lg"> kcal</span>
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <NutritionDisplay
                colorClass="bg-protein"
                current={currentDayNutrition.protein}
                icon={<DumbbellIcon className="size-5 text-protein" />}
                label="Protein"
                target={userTargets?.protein}
              />
              <NutritionDisplay
                colorClass="bg-carbs"
                current={currentDayNutrition.carbs}
                icon={<BananaIcon className="size-5 text-carbs" />}
                label="Carbs"
                target={userTargets?.carbs}
              />
              <NutritionDisplay
                colorClass="bg-fat"
                current={currentDayNutrition.fat}
                icon={<IceCreamConeIcon className="size-5 text-fat" />}
                label="Fat"
                target={userTargets?.fat}
              />
            </div>
          </div>
        )}

        <div className={`${showDayView ? "border-t pt-4" : ""} space-y-4`}>
          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              {showDayView ? "Average daily nutrition" : "Average Daily Calories"}
            </div>
            <div className={`font-semibold ${showDayView ? "text-lg" : "text-2xl"}`}>
              {Math.round(averageDailyNutrition.calories)}
              {userTargets && (
                <span className="ml-1">
                  / {Math.round(userTargets.calories || 0)}
                  <span className={`${showDayView ? "text-sm" : "text-lg"}`}> kcal</span>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <NutritionDisplay
              colorClass="bg-protein"
              current={averageDailyNutrition.protein}
              icon={<DumbbellIcon className="size-5 text-protein" />}
              label={showDayView ? "Avg Protein" : "Protein"}
              target={userTargets?.protein}
            />
            <NutritionDisplay
              colorClass="bg-carbs"
              current={averageDailyNutrition.carbs}
              icon={<BananaIcon className="size-5 text-carbs" />}
              label={showDayView ? "Avg Carbs" : "Carbs"}
              target={userTargets?.carbs}
            />
            <NutritionDisplay
              colorClass="bg-fat"
              current={averageDailyNutrition.fat}
              icon={<IceCreamConeIcon className="size-5 text-fat" />}
              label={showDayView ? "Avg Fat" : "Fat"}
              target={userTargets?.fat}
            />
          </div>
        </div>

        {!userTargets && (
          <div className="text-center text-muted-foreground text-xs">
            Complete your profile to see nutrition targets
          </div>
        )}
      </CardContent>
    </Card>
  );
}
