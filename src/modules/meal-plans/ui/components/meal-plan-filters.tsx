"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MealPlanSortBy, MealPlanStatus } from "../../types";
import { useMealPlanFilters } from "../hooks/use-meal-plan-filters";

export function MealPlanFilters() {
  const [filters, setFilters] = useMealPlanFilters();

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div className="relative">
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
        <Input
          className="w-[200px] pl-10"
          onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
          placeholder="Search meal plans..."
          value={filters.search}
        />
      </div>
      <Select
        onValueChange={(value) => setFilters({ status: value as MealPlanStatus, page: 1 })}
        value={filters.status}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plans</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split("-") as [MealPlanSortBy, "asc" | "desc"];
          setFilters({ sortBy, sortOrder, page: 1 });
        }}
        value={`${filters.sortBy}-${filters.sortOrder}`}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
          <SelectItem value="startDate-desc">Start Date (Latest)</SelectItem>
          <SelectItem value="startDate-asc">Start Date (Earliest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
