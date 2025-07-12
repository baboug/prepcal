"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/lib/trpc/client";
import { COOKING_UNITS } from "../../constants";
import { createRecipeSchema } from "../../schemas";

type FormData = z.infer<typeof createRecipeSchema>;

interface RecipeFormProps {
  onSuccess?: () => void;
}

export function RecipeForm({ onSuccess }: RecipeFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createRecipe = useMutation(
    trpc.recipes.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.recipes.getMany.queryOptions({}));
        toast.success("Recipe created successfully!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<FormData>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: "",
      description: "",
      category: [],
      cuisine: [],
      keywords: [],
      ingredients: [{ name: "", amount: undefined, unit: "", notes: "" }],
      instructions: [{ step: "" }],
      prepTime: undefined,
      cookTime: undefined,
      calories: undefined,
      macros: { protein: 0, carbs: 0, fat: 0 },
      servings: undefined,
      imageUrl: "",
      sourceUrl: "",
      videoUrl: "",
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  const isLoading = createRecipe.isPending;

  const onSubmit = (values: FormData) => {
    createRecipe.mutate(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Creamy Chicken Pasta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief description of your recipe..." rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="prepTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prep Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="15"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cookTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cook Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="30"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input
                    className="max-w-32"
                    placeholder="4"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">Ingredients</FormLabel>
            <Button
              onClick={() => appendIngredient({ name: "", amount: undefined, unit: "", notes: "" })}
              size="sm"
              type="button"
              variant="outline"
            >
              <PlusIcon className="size-4" />
              Add Ingredient
            </Button>
          </div>
          <div className="space-y-3">
            {ingredientFields.map((field, index) => (
              <div className="space-y-2" key={field.id}>
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Ingredient name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={ingredientFields.length <= 1}
                    onClick={() => removeIngredient(index)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Amount"
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {COOKING_UNITS.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.notes`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Notes (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        {/* Instructions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">Instructions</FormLabel>
            <Button onClick={() => appendInstruction({ step: "" })} size="sm" type="button" variant="outline">
              <PlusIcon className="size-4" />
              Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {instructionFields.map((field, index) => (
              <div className="flex items-end gap-2" key={field.id}>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`instructions.${index}.step`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder={`Step ${index + 1}...`} rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  disabled={instructionFields.length <= 1}
                  onClick={() => removeInstruction(index)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        {/* Nutrition Information */}
        <div className="space-y-4">
          <FormLabel className="text-base">Nutrition Information (Optional)</FormLabel>
          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories per serving</FormLabel>
                <FormControl>
                  <Input
                    className="max-w-32"
                    placeholder="350"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="macros.protein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein (g)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="25"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="macros.carbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbs (g)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="30"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="macros.fat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat (g)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="15"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <FormLabel className="text-base">Additional Information (Optional)</FormLabel>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/recipe-image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/original-recipe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create Recipe
          </Button>
        </div>
      </form>
    </Form>
  );
}
