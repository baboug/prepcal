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
    category: text("category").array(),
    cuisine: text("cuisine").array(),
    keywords: text("keywords").array(),
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
            duration: string;
            thumbnailUrl: string;
          };
        }[]
      >()
      .notNull(),
    prepTime: integer("prep_time"),
    cookTime: integer("cook_time"),
    calories: integer("calories"),
    macros: jsonb("macros").$type<{
      protein: number;
      carbs: number;
      fat: number;
    }>(),
    servings: integer("servings"),
    imageUrl: text("image_url"),
    sourceUrl: text("source_url"),
    videoUrl: text("video_url"),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("recipe_user_id_idx").on(table.userId),
    nameIdx: index("recipe_name_idx").on(table.name),
    isPublicIdx: index("recipe_is_public_idx").on(table.isPublic),
    categoryIdx: index("recipe_category_idx").on(table.category),
    cuisineIdx: index("recipe_cuisine_idx").on(table.cuisine),
    keywordsIdx: index("recipe_keywords_idx").on(table.keywords),
  })
);

export const recipeRelations = relations(recipe, ({ one }) => ({
  user: one(user, {
    fields: [recipe.userId],
    references: [user.id],
    relationName: "userRecipes",
  }),
}));

export type Recipe = typeof recipe.$inferSelect;
