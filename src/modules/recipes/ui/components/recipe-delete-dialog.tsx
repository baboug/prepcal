"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTRPC } from "@/lib/trpc/client";
import type { RecipesGetOne } from "../../types";

interface RecipeDeleteDialogProps {
  children: React.ReactNode;
  recipe: RecipesGetOne;
  onSuccess?: () => void;
  redirectOnDelete?: boolean;
}

export function RecipeDeleteDialog({ children, recipe, onSuccess, redirectOnDelete = false }: RecipeDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteRecipe = useMutation(
    trpc.recipes.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.recipes.getMany.queryOptions({}));
        toast.success("Recipe deleted successfully!");
        setIsOpen(false);

        if (redirectOnDelete) {
          router.push("/recipes");
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleDelete = () => {
    if (!recipe?.id) {
      return;
    }
    deleteRecipe.mutate({ id: recipe.id });
  };

  if (!recipe) {
    return null;
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteRecipe.isPending}
            onClick={handleDelete}
          >
            {deleteRecipe.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="mr-2 size-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
