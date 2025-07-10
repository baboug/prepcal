"use client";

import { Calendar, MarsIcon, User, VenusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS } from "@/modules/profile/utils/constants";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

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
            <Calendar className="size-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-lg">When were you born?</h3>
          </div>
          <p className="text-muted-foreground text-sm">Select the day, month, and year that you were born.</p>
        </div>
        <div className="flex items-center gap-6">
          <FormField
            control={form.control}
            name="birthDate.day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate.month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate.year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
