"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RecipesGetOne } from "../../types";
import { RecipeForm } from "./recipe-form";

interface RecipeEditDialogProps {
  children: React.ReactNode;
  recipe: RecipesGetOne;
}

export function RecipeEditDialog({ children, recipe }: RecipeEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <RecipeForm initialValues={recipe} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
