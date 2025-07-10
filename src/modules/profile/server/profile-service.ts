import { TRPCError } from "@trpc/server";

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
    console.error("Error creating user profile:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create user profile",
    });
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
    console.error("Error updating user profile:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update user profile",
    });
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
    console.error("Error getting user profile:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get user profile",
    });
  }
};
