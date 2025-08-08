import { relations } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgEnum, pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Billing and usage
export const userBilling = pgTable("user_billing", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  plan: text("plan").notNull().default("free"), // 'free' | 'pro'
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserBilling = typeof userBilling.$inferSelect;
export type InsertUserBilling = typeof userBilling.$inferInsert;

export const usageEvent = pgTable("usage_event", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // e.g., 'ai_generate'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type UsageEvent = typeof usageEvent.$inferSelect;
export type InsertUsageEvent = typeof usageEvent.$inferInsert;

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
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  dietType: dietTypeEnum("diet_type").notNull(),
  gender: genderEnum("gender").notNull(),
  birthDate: text("birth_date").notNull(),
  heightUnit: heightUnitEnum("height_unit").notNull(),
  heightValue: real("height_value"),
  heightFeet: integer("height_feet"),
  heightInches: integer("height_inches"),
  weightUnit: weightUnitEnum("weight_unit").notNull(),
  weightValue: real("weight_value").notNull(),
  activityLevel: activityLevelEnum("activity_level").notNull(),
  goal: goalEnum("goal").notNull(),
  customCalorieDeficit: real("custom_calorie_deficit"),
  proteinAmount: proteinAmountEnum("protein_amount").notNull(),
  customProteinAmount: real("custom_protein_amount"),
  fatCarbSplit: real("fat_carb_split").notNull().default(30),
  bodyFat: real("body_fat"),
  muscleMass: muscleMassEnum("muscle_mass"),
  dailySteps: integer("daily_steps"),
  maxCarbs: real("max_carbs"),
  bmr: real("bmr"),
  tdee: real("tdee"),
  calories: real("calories"),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type InsertUserProfile = typeof userProfile.$inferInsert;

export const recipe = pgTable(
  "recipe",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }), // Optional if it's a public recipe
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").array().notNull().default([]),
    cuisine: text("cuisine").array().notNull().default([]),
    keywords: text("keywords").array().notNull().default([]),
    ingredients: jsonb("ingredients")
      .$type<
        {
          name: string;
          amount?: number;
          unit?: string;
          notes?: string;
        }[]
      >()
      .notNull(),
    instructions: jsonb("instructions")
      .$type<
        {
          step: string;
          video?: {
            url: string;
            duration?: string;
            thumbnailUrl?: string;
          };
        }[]
      >()
      .notNull(),
    prepTime: integer("prep_time"),
    cookTime: integer("cook_time"),
    calories: integer("calories"),
    macros: jsonb("macros")
      .$type<{
        protein: number;
        carbs: number;
        fat: number;
      }>()
      .notNull()
      .default({ protein: 0, carbs: 0, fat: 0 }),
    servings: integer("servings"),
    imageUrl: text("image_url"),
    sourceUrl: text("source_url"),
    videoUrl: text("video_url"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("recipe_user_id_idx").on(table.userId),
    nameIdx: index("recipe_name_idx").on(table.name),
    categoryIdx: index("recipe_category_idx").on(table.category),
    cuisineIdx: index("recipe_cuisine_idx").on(table.cuisine),
    keywordsIdx: index("recipe_keywords_idx").on(table.keywords),
  })
);

export const recipeRelations = relations(recipe, ({ one, many }) => ({
  user: one(user, {
    fields: [recipe.userId],
    references: [user.id],
    relationName: "userRecipes",
  }),
  meals: many(meal, {
    relationName: "mealRecipes",
  }),
}));

export type Recipe = typeof recipe.$inferSelect;

export const mealTypeEnum = pgEnum("meal_type", ["breakfast", "lunch", "dinner", "snack"]);

export const mealPlan = pgTable(
  "meal_plan",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    startDate: text("start_date").notNull(), // Store as ISO date string
    endDate: text("end_date").notNull(), // Store as ISO date string
    mealsPerDay: integer("meals_per_day").notNull().default(3),
    targetCalories: real("target_calories"),
    targetProtein: real("target_protein"),
    targetCarbs: real("target_carbs"),
    targetFat: real("target_fat"),
    shoppingList: text("shopping_list"),
    mealPrepPlan: text("meal_prep_plan"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("meal_plan_user_id_idx").on(table.userId),
    startDateIdx: index("meal_plan_start_date_idx").on(table.startDate),
    endDateIdx: index("meal_plan_end_date_idx").on(table.endDate),
  })
);

export const meal = pgTable(
  "meal",
  {
    id: serial("id").primaryKey(),
    mealPlanId: integer("meal_plan_id")
      .notNull()
      .references(() => mealPlan.id, { onDelete: "cascade" }),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    day: integer("day").notNull(), // 1-based day number (1, 2, 3, etc.)
    mealType: mealTypeEnum("meal_type").notNull(),
    servingSize: real("serving_size").notNull().default(1.0), // Multiplier for recipe servings
    sortOrder: integer("sort_order").notNull().default(0), // For custom ordering within a day/meal type
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => ({
    mealPlanIdIdx: index("meal_meal_plan_id_idx").on(table.mealPlanId),
    dayIdx: index("meal_day_idx").on(table.day),
    mealTypeIdx: index("meal_meal_type_idx").on(table.mealType),
    recipeIdIdx: index("meal_recipe_id_idx").on(table.recipeId),
  })
);

export const mealPlanRelations = relations(mealPlan, ({ one, many }) => ({
  user: one(user, {
    fields: [mealPlan.userId],
    references: [user.id],
    relationName: "userMealPlans",
  }),
  meals: many(meal, {
    relationName: "mealPlanMeals",
  }),
}));

export const mealRelations = relations(meal, ({ one }) => ({
  mealPlan: one(mealPlan, {
    fields: [meal.mealPlanId],
    references: [mealPlan.id],
    relationName: "mealPlanMeals",
  }),
  recipe: one(recipe, {
    fields: [meal.recipeId],
    references: [recipe.id],
    relationName: "mealRecipes",
  }),
}));

export type MealPlan = typeof mealPlan.$inferSelect;
export type InsertMealPlan = typeof mealPlan.$inferInsert;
export type Meal = typeof meal.$inferSelect;
export type InsertMeal = typeof meal.$inferInsert;
