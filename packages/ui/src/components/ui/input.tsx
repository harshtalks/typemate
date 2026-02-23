import { Input as InputPrimitive } from "@base-ui/react/input";
import { SpinnerIcon } from "@phosphor-icons/react";
import { cn } from "@typemate/ui/lib/utils";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      className={cn(
        "h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

function InputWithSpinner({
  className,
  type,
  isLoading,
  ...props
}: React.ComponentProps<"input"> & { isLoading?: boolean }) {
  return (
    <div className="relative">
      <Input
        className={cn(
          "peer [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          className
        )}
        placeholder="Search..."
        type={type}
        {...props}
      />
      <SpinnerIcon
        className={cn(
          "absolute top-1/2 right-1 size-5 -translate-y-1/2 animate-spin rounded-l-none text-muted-foreground transition-opacity hover:bg-transparent focus-visible:ring-ring/50",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

export { Input, InputWithSpinner };
