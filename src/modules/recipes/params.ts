import { createLoader, parseAsBoolean, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

import { DEFAULT_PAGE } from "@/lib/constants";

export const filtersSearchParams = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  category: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  cuisine: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  myRecipes: parseAsBoolean.withDefault(false).withOptions({
    clearOnDefault: true,
  }),
  sortBy: parseAsStringEnum(["default", "calories", "protein", "carbs", "fat", "time", "name"])
    .withDefault("default")
    .withOptions({
      clearOnDefault: true,
    }),
  sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc").withOptions({
    clearOnDefault: true,
  }),
  // Range filters
  minCalories: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  maxCalories: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  minProtein: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  maxProtein: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  minCarbs: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  maxCarbs: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  minFat: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  maxFat: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  minTime: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
  maxTime: parseAsInteger.withDefault(0).withOptions({
    clearOnDefault: true,
  }),
};

export const loadSearchParams = createLoader(filtersSearchParams);
