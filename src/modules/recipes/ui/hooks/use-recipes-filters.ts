import { parseAsBoolean, parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { DEFAULT_PAGE } from "@/lib/constants";

export function useRecipesFilters() {
  const [filters, setFilters] = useQueryStates({
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
  });

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "",
      cuisine: "",
      myRecipes: false,
      sortBy: "default",
      sortOrder: "desc",
      minCalories: 0,
      maxCalories: 0,
      minProtein: 0,
      maxProtein: 0,
      minCarbs: 0,
      maxCarbs: 0,
      minFat: 0,
      maxFat: 0,
      minTime: 0,
      maxTime: 0,
      page: 1,
    });
  };

  const activeFiltersCount = [
    !!filters.search,
    !!filters.category,
    !!filters.cuisine,
    filters.myRecipes,
    filters.sortBy !== "default",
    filters.sortOrder !== "desc",
    filters.minCalories > 0,
    filters.maxCalories > 0,
    filters.minProtein > 0,
    filters.maxProtein > 0,
    filters.minCarbs > 0,
    filters.maxCarbs > 0,
    filters.minFat > 0,
    filters.maxFat > 0,
    filters.minTime > 0,
    filters.maxTime > 0,
  ].filter(Boolean).length;

  return { filters, setFilters, clearAllFilters, activeFiltersCount } as const;
}
