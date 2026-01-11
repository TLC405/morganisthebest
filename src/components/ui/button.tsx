import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-wide ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-0.5",
  {
    variants: {
      variant: {
        // Primary - Embossed terracotta
        default: "bg-primary text-primary-foreground border-2 border-primary shadow-hard-sm hover:shadow-hard hover:-translate-y-0.5 active:shadow-none",
        // Secondary - Sage green
        secondary: "bg-secondary text-secondary-foreground border-2 border-secondary shadow-hard-sm hover:shadow-hard hover:-translate-y-0.5 active:shadow-none",
        // Destructive
        destructive: "bg-destructive text-destructive-foreground border-2 border-destructive shadow-hard-sm hover:shadow-hard hover:-translate-y-0.5 active:shadow-none",
        // Outline - Industrial border
        outline: "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        // Ghost - Minimal
        ghost: "hover:bg-muted hover:text-foreground",
        // Link - Underline style
        link: "text-primary underline-offset-4 hover:underline uppercase tracking-wider",
        // Premium - Debossed card style
        premium: "bg-card border-2 border-border text-foreground sku-raised hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-sm",
        sm: "h-9 px-4 rounded-sm text-xs",
        lg: "h-12 px-8 rounded-sm",
        xl: "h-14 px-10 rounded-sm text-base",
        icon: "h-10 w-10 rounded-sm",
        "icon-sm": "h-8 w-8 rounded-sm",
        "icon-lg": "h-12 w-12 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
