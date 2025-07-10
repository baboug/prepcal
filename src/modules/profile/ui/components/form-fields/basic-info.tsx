"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, MarsIcon, User, VenusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function BasicInfo() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-semibold text-2xl">Tell us about yourself</h2>
        <p className="text-accent-foreground">
          This information helps us calculate your personalized nutrition needs accurately.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="size-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-lg">What is your sex?</h3>
          </div>
          <p className="text-muted-foreground text-sm">Your sex will be used to calculate your metabolic rate.</p>
        </div>
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup className="grid gap-3 md:grid-cols-2" onValueChange={field.onChange} value={field.value}>
                  <RadioGroupCard
                    icon={
                      <div>
                        <MarsIcon className="size-4" />
                      </div>
                    }
                    id="male"
                    label="Male"
                    value="male"
                  />
                  <RadioGroupCard
                    icon={
                      <div>
                        <VenusIcon className="size-4" />
                      </div>
                    }
                    id="female"
                    label="Female"
                    value="female"
                  />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-lg">When were you born?</h3>
          </div>
          <p className="text-muted-foreground text-sm">Select the day, month, and year that you were born.</p>
        </div>
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex w-fit flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      variant="outline"
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    captionLayout="dropdown"
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    mode="single"
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    selected={field.value}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
