"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-4 rounded-full border border-input shadow-black/5 shadow-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      ref={ref}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg fill="currentColor" height="6" viewBox="0 0 6 6" width="6" xmlns="http://www.w3.org/2000/svg">
          <title>Radio</title>
          <circle cx="3" cy="3" r="3" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label: string;
    subLabel?: React.ReactNode;
    description?: string;
    icon?: React.ReactNode;
  }
>(({ className, label, subLabel, description, icon, ...props }, ref) => {
  return (
    <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-black/5 shadow-sm has-[[data-state=checked]]:border-ring">
      <RadioGroupItem className={cn("order-1 after:absolute after:inset-0", className)} ref={ref} {...props} />
      <div className="flex grow items-center gap-3">
        {icon}
        <div className={cn("grid grow", description && "gap-2")}>
          <Label className="text-sm" htmlFor={`${props.id}`}>
            {label} <span className="font-normal text-muted-foreground text-xs leading-[inherit]">{subLabel}</span>
          </Label>
          <p className="text-muted-foreground text-xs" id={`${props.id}-description`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});
RadioGroupCard.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem, RadioGroupCard };
