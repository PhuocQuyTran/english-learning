import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] font-mono text-[0.95rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3FB950] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#3FB950] text-[#0D1117] hover:bg-[#3FB950]/90 font-semibold",
        destructive:
          "bg-[#F85149] text-[#0D1117] hover:bg-[#F85149]/90 font-semibold",
        outline:
          "border border-[#8B949E] bg-[#161B22] text-[#E6EDF3] hover:bg-[#8B949E]/10 hover:text-[#3FB950] hover:border-[#3FB950]",
        secondary:
          "bg-[#161B22] text-[#E6EDF3] border border-transparent hover:border-[#8B949E]",
        ghost: "text-[#E6EDF3] hover:bg-[#161B22] hover:text-[#3FB950]",
        link: "text-[#3FB950] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-[20px] py-[12px]",
        sm: "h-8 rounded-[4px] px-3 text-xs",
        lg: "h-11 rounded-[8px] px-8 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
