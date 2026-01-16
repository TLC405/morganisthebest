import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Default - Royal Blue gradient
        default: "bg-gradient-to-r from-primary to-[hsl(225_80%_60%)] text-primary-foreground shadow-soft hover:shadow-glow",
        // Secondary - Bronze/Gold accent
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90",
        // Destructive
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
        // Outline - Elegant border
        outline: "border-2 border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/40",
        // Ghost - Minimal
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        // Link
        link: "text-primary underline-offset-4 hover:underline",
        // Premium - Blue with glow
        premium: "bg-gradient-to-r from-primary via-[hsl(220_75%_58%)] to-primary text-primary-foreground shadow-glow hover:shadow-glow-lg",
        // Accent - Lavender
        accent: "bg-accent text-accent-foreground shadow-soft hover:bg-accent/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
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
