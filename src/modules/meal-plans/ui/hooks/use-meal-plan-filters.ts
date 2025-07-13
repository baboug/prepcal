import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { DEFAULT_PAGE } from "@/lib/constants";
import { MealPlanStatus } from "../../types";

export function useMealPlanFilters() {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
      clearOnDefault: true,
    }),
    status: parseAsStringEnum(Object.values(MealPlanStatus)).withDefault(MealPlanStatus.ACTIVE).withOptions({
      clearOnDefault: true,
    }),
    sortBy: parseAsStringEnum(["name", "startDate", "endDate", "createdAt"]).withDefault("createdAt").withOptions({
      clearOnDefault: true,
    }),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc").withOptions({
      clearOnDefault: true,
    }),
  });
}
