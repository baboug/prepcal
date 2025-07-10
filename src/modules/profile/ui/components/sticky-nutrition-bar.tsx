"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NutritionTargetsCard } from "./nutrition-targets-card";

interface StickyNutritionBarProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function StickyNutritionBar({ calories, protein, carbs, fat }: StickyNutritionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background shadow-lg xl:hidden">
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto p-4">
          <NutritionTargetsCard calories={calories} carbs={carbs} fat={fat} protein={protein} />
        </div>
      )}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <Nutrition className="text-calories-foreground" label="Cal" value={calories} />
          <Nutrition className="text-protein-foreground" label="P" value={protein} />
          <Nutrition className="text-carbs-foreground" label="C" value={carbs} />
          <Nutrition className="text-fat-foreground" label="F" value={fat} />
        </div>
        <Button onClick={() => setIsExpanded(!isExpanded)} size="icon" variant="ghost">
          {isExpanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

function Nutrition({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}
