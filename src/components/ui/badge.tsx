import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default - Rose gold with soft glow
        default: "border-transparent bg-primary/20 text-primary",
        // Secondary - Champagne
        secondary: "border-transparent bg-secondary/20 text-secondary",
        // Destructive
        destructive: "border-transparent bg-destructive/20 text-destructive",
        // Outline - Elegant border
        outline: "border-border text-foreground bg-transparent",
        // Muted - Subtle
        muted: "border-border/50 bg-muted text-muted-foreground",
        // Success - Green
        success: "border-transparent bg-[hsl(160_50%_50%)]/20 text-[hsl(160_50%_50%)]",
        // Warning - Amber
        warning: "border-transparent bg-[hsl(38_80%_55%)]/20 text-[hsl(38_80%_55%)]",
        // Accent - Lavender
        accent: "border-transparent bg-accent/20 text-accent",
        // Premium - Glass effect
        premium: "glass-subtle border-primary/30 text-primary",
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
