import { TRPCError } from "@trpc/server";
import { handleServiceError } from "@/lib/trpc/utils";
import { profileSchema } from "../schemas";
import type { ProfileData } from "../types";
import { calculateNutritionProfile } from "../utils/calculations";
import { mapProfileDataToDbSchema, mapProfileToResponse } from "../utils/mappers";
import * as profileRepository from "./profile-repository";

export const createProfile = async (userId: string, data: ProfileData) => {
  try {
    const validatedData = profileSchema.parse(data);

    const existingProfile = await profileRepository.getUserProfile(userId);
    if (existingProfile) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User profile already exists. Use update instead.",
      });
    }

    const nutritionValues = calculateNutritionProfile(validatedData);
    const dataWithNutrition = { ...validatedData, ...nutritionValues };
    const dbData = mapProfileDataToDbSchema(dataWithNutrition, userId);

    const profile = await profileRepository.createUserProfile(dbData);

    return mapProfileToResponse(profile);
  } catch (error) {
    handleServiceError(error, "Failed to create user profile");
  }
};

export const updateProfile = async (userId: string, data: Partial<ProfileData>) => {
  try {
    const validatedData = profileSchema.partial().parse(data);

    const existingProfile = await profileRepository.getUserProfile(userId);
    if (!existingProfile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User profile not found. Complete onboarding first.",
      });
    }

    const currentProfileData = mapProfileToResponse(existingProfile);
    const mergedData = { ...currentProfileData, ...validatedData } as ProfileData;
    const nutritionValues = calculateNutritionProfile(mergedData);
    const updatedProfileData = { ...mergedData, ...nutritionValues };
    const dbData = mapProfileDataToDbSchema(updatedProfileData, userId);

    const updatedProfile = await profileRepository.updateUserProfile(userId, dbData);

    return mapProfileToResponse(updatedProfile);
  } catch (error) {
    handleServiceError(error, "Failed to update user profile");
  }
};

export const getProfile = async (userId: string) => {
  try {
    const profile = await profileRepository.getUserProfile(userId);

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User profile not found",
      });
    }

    return mapProfileToResponse(profile);
  } catch (error) {
    handleServiceError(error, "Failed to get user profile");
  }
};
