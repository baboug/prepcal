import { boolean, integer, pgEnum, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  onboardingComplete: boolean().notNull().default(false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const dietTypeEnum = pgEnum("diet_type", ["standard", "leangains", "keto"]);
export const genderEnum = pgEnum("gender", ["male", "female"]);
export const heightUnitEnum = pgEnum("height_unit", ["cm", "ft"]);
export const weightUnitEnum = pgEnum("weight_unit", ["kg", "lbs"]);
export const activityLevelEnum = pgEnum("activity_level", [
  "sedentary",
  "lightlyActive",
  "moderatelyActive",
  "veryActive",
  "extremelyActive",
]);
export const goalEnum = pgEnum("goal", [
  "loseWeight",
  "loseWeightSlowly",
  "maintain",
  "gainWeightSlowly",
  "gainWeight",
]);
export const proteinAmountEnum = pgEnum("protein_amount", ["0.82", "1.0", "1.5", "custom"]);
export const muscleMassEnum = pgEnum("muscle_mass", ["standard", "muscular", "veryMuscular"]);

export const userProfile = pgTable("user_profile", {
  userId: text()
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  dietType: dietTypeEnum().notNull(),
  gender: genderEnum().notNull(),
  birthMonth: integer().notNull(),
  birthDay: integer().notNull(),
  birthYear: integer().notNull(),
  heightUnit: heightUnitEnum().notNull(),
  heightValue: real(),
  heightFeet: integer(),
  heightInches: integer(),
  weightUnit: weightUnitEnum().notNull(),
  weightValue: real().notNull(),
  activityLevel: activityLevelEnum().notNull(),
  goal: goalEnum().notNull(),
  customCalorieDeficit: real(),
  proteinAmount: proteinAmountEnum().notNull(),
  customProteinAmount: real(),
  fatCarbSplit: real().notNull().default(30),
  bodyFat: real(),
  muscleMass: muscleMassEnum(),
  dailySteps: integer(),
  maxCarbs: real(),
  bmr: real(),
  tdee: real(),
  calories: integer(),
  protein: integer(),
  carbs: integer(),
  fat: integer(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type InsertUserProfile = typeof userProfile.$inferInsert;
