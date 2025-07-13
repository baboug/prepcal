import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

import { DEFAULT_PAGE } from "@/lib/constants";
import { MealPlanSortBy, MealPlanStatus } from "./types";

export const mealPlanFiltersSearchParams = {
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  status: parseAsStringEnum(Object.values(MealPlanStatus)).withDefault(MealPlanStatus.ACTIVE).withOptions({
    clearOnDefault: true,
  }),
  sortBy: parseAsStringEnum(Object.values(MealPlanSortBy)).withDefault(MealPlanSortBy.CREATED_AT).withOptions({
    clearOnDefault: true,
  }),
  sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc").withOptions({
    clearOnDefault: true,
  }),
};

export const loadMealPlanFilters = createLoader(mealPlanFiltersSearchParams);
