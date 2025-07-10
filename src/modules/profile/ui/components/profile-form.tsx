"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTRPC } from "@/lib/trpc/client";
import { profileSchema } from "@/modules/profile/schemas";
import type { ProfileData } from "@/modules/profile/types";
import { NutritionTargetsCard } from "@/modules/profile/ui/components/nutrition-targets-card";
import { StickyNutritionBar } from "@/modules/profile/ui/components/sticky-nutrition-bar";
import { calculateNutritionProfile } from "@/modules/profile/utils/calculations";
import { ActivityLevel } from "./form-fields/activity-level";
import { AdvancedSettings } from "./form-fields/advanced-settings";
import { BasicInfo } from "./form-fields/basic-info";
import { DietType } from "./form-fields/diet-type";
import { Goals } from "./form-fields/goals";
import { PhysicalStats } from "./form-fields/physical-stats";

interface ProfileFormProps {
  profile: ProfileData;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateProfile = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.get.queryOptions());
        toast.success("🎉 Profile updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    })
  );

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const formData = form.watch() as ProfileData;

  const onSubmit = (data: ProfileData) => {
    const nutritionValues = calculateNutritionProfile(data);
    const dataWithNutrition = {
      ...data,
      ...nutritionValues,
    };
    updateProfile.mutate(dataWithNutrition);
  };

  const { calories, protein, carbs, fat } = calculateNutritionProfile(formData);

  return (
    <div className="relative grid gap-8 xl:grid-cols-[1fr_400px]">
      <Form {...form}>
        <form className="space-y-6 pb-18 xl:pb-6" onSubmit={form.handleSubmit(onSubmit)}>
          <DietType />
          <BasicInfo />
          <PhysicalStats />
          <ActivityLevel />
          <Goals />
          <AdvancedSettings />
          <Button disabled={updateProfile.isPending} isLoading={updateProfile.isPending} type="submit">
            Save
          </Button>
        </form>
      </Form>
      <div className="hidden xl:block">
        <div className="sticky top-8">
          <NutritionTargetsCard calories={calories} carbs={carbs} fat={fat} protein={protein} />
        </div>
      </div>
      <StickyNutritionBar calories={calories} carbs={carbs} fat={fat} protein={protein} />
    </div>
  );
}
