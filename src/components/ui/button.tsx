import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:shadow-destructive/20",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg hover:shadow-secondary/20",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium variants
        glow: "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]",
        "glow-secondary": "bg-secondary text-secondary-foreground shadow-glow-thunder hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]",
        gradient: "gradient-primary text-primary-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        "gradient-thunder": "gradient-thunder text-secondary-foreground shadow-lg hover:shadow-glow-thunder hover:scale-[1.02] active:scale-[0.98]",
        premium: "bg-card border border-border/50 text-foreground hover:border-primary/50 hover:bg-card/80 shadow-premium hover:shadow-glow transition-all",
        neon: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 neon-glow-pink hover:shadow-glow-lg",
        "neon-blue": "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10 neon-glow-blue hover:shadow-glow-thunder",
        glass: "glass border-0 text-foreground hover:bg-card/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
