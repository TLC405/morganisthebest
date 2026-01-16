import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default - Blue primary
        default: "border-transparent bg-primary/15 text-primary",
        // Secondary - Bronze
        secondary: "border-transparent bg-secondary/15 text-secondary",
        // Destructive
        destructive: "border-transparent bg-destructive/15 text-destructive",
        // Outline - Elegant border
        outline: "border-border text-foreground bg-transparent",
        // Muted - Subtle
        muted: "border-border/50 bg-muted text-muted-foreground",
        // Success - Green
        success: "border-transparent bg-[hsl(160_50%_45%)]/15 text-[hsl(160_50%_40%)]",
        // Warning - Amber
        warning: "border-transparent bg-[hsl(38_80%_50%)]/15 text-[hsl(38_75%_45%)]",
        // Accent - Lavender
        accent: "border-transparent bg-accent/15 text-accent",
        // Premium - Blue gradient
        premium: "border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 text-primary",
        // Trust - Blue with icon-ready spacing
        trust: "border-primary/20 bg-primary/10 text-primary font-semibold",
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
