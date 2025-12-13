import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: "text-foreground border-border",
        // Premium variants
        glow: "border-transparent bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg",
        "glow-secondary": "border-transparent bg-secondary text-secondary-foreground shadow-glow-thunder",
        gradient: "border-0 gradient-primary text-primary-foreground shadow-sm",
        "gradient-thunder": "border-0 gradient-thunder text-secondary-foreground shadow-sm",
        glass: "glass border-0 text-foreground shadow-sm",
        premium: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
        "premium-secondary": "border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20",
        success: "border-transparent bg-emerald-500/90 text-white shadow-sm",
        warning: "border-transparent bg-amber-500/90 text-white shadow-sm",
        pulse: "border-transparent bg-primary text-primary-foreground animate-pulse shadow-glow",
        shimmer: "border-0 shimmer bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
