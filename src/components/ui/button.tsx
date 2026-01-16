import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Rose gold gradient with soft glow
        default: "bg-gradient-to-r from-primary to-[hsl(350_75%_50%)] text-primary-foreground shadow-md hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        // Secondary - Champagne gold, refined
        secondary: "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 hover:shadow-lg active:scale-[0.98]",
        // Destructive
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg active:scale-[0.98]",
        // Outline - Elegant border with gradient on hover
        outline: "border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/50 hover:text-primary",
        // Ghost - Minimal
        ghost: "hover:bg-muted hover:text-foreground",
        // Link - Underline style
        link: "text-primary underline-offset-4 hover:underline",
        // Premium - Glass effect with shimmer
        premium: "glass-card border-primary/30 text-foreground hover:border-primary/50 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        // Accent - Lavender gradient
        accent: "bg-gradient-to-r from-accent to-[hsl(280_50%_60%)] text-accent-foreground shadow-md hover:shadow-glow-accent hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-xl",
        sm: "h-9 px-4 rounded-lg text-xs",
        lg: "h-12 px-8 rounded-xl",
        xl: "h-14 px-10 rounded-2xl text-base font-semibold",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
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
