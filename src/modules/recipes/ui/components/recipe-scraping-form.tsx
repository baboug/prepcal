"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/lib/trpc/client";
import { scrapeRecipeSchema } from "../../schemas";

type ScrapeFormData = z.infer<typeof scrapeRecipeSchema>;

interface RecipeScrapingFormProps {
  onSuccess?: () => void;
}

export function RecipeScrapingForm({ onSuccess }: RecipeScrapingFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const scrapeAndCreate = useMutation(
    trpc.recipes.scrapeAndCreate.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.recipes.getMany.queryOptions({}));
        toast.success("Recipe scraped and created successfully!");
        form.reset();
        setIsExpanded(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<ScrapeFormData>({
    resolver: zodResolver(scrapeRecipeSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: ScrapeFormData) => {
    scrapeAndCreate.mutate(values);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setIsExpanded(!isExpanded)} size="sm" type="button" variant="outline">
          <LinkIcon className="size-4" />
          {isExpanded ? "Hide" : "Import from URL"}
        </Button>
      </div>
      {isExpanded && (
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/recipe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={scrapeAndCreate.isPending} isLoading={scrapeAndCreate.isPending} type="submit">
              Import Recipe
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
