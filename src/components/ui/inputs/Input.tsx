import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout & Typography
          "flex h-9 w-full rounded-[6px] px-3 py-1 font-mono text-[0.95rem] transition-colors",
          // Colors & Borders (Terminal Theme)
          "border border-[#8B949E] bg-[#161B22] text-[#E6EDF3]",
          "placeholder:text-[#8B949E]/70",
          // Focus State
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3FB950] focus-visible:border-[#3FB950]",
          // Disabled & File States
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:font-mono file:text-sm file:font-medium file:text-[#E6EDF3]",
          // Error State
          error &&
            "border-[#F85149] focus-visible:ring-[#F85149] focus-visible:border-[#F85149]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
