import { SearchIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

interface SearchInputProps extends React.ComponentProps<"input"> {
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
  placeholder?: string;
}

function SearchInput({
  className,
  containerClassName,
  iconClassName,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Input className={cn("pl-7", className)} placeholder={placeholder} {...props} />
      <SearchIcon
        className={cn("-translate-y-1/2 absolute top-1/2 left-2 size-4 text-muted-foreground", iconClassName)}
      />
    </div>
  );
}

export { SearchInput };
