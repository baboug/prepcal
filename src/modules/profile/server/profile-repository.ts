import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type InsertUserProfile, type UserProfile, user, userProfile } from "@/lib/db/schema";

export const createUserProfile = async (data: Omit<InsertUserProfile, "id">): Promise<UserProfile> => {
  const [profile] = await db.insert(userProfile).values(data).returning();

  if (!profile) {
    throw new Error("Failed to create user profile");
  }

  await db.update(user).set({ onboardingComplete: true }).where(eq(user.id, data.userId));

  return profile;
};

export const updateUserProfile = async (userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile> => {
  const [updatedProfile] = await db.update(userProfile).set(data).where(eq(userProfile.userId, userId)).returning();

  if (!updatedProfile) {
    throw new Error("Failed to update user profile or profile not found");
  }

  return updatedProfile;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const [profile] = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1);

  return profile || null;
};
