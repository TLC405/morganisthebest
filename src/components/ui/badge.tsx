import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border-2 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default - Stamped metal look
        default: "border-primary bg-primary text-primary-foreground shadow-hard-sm",
        // Secondary - Sage
        secondary: "border-secondary bg-secondary text-secondary-foreground shadow-hard-sm",
        // Destructive
        destructive: "border-destructive bg-destructive text-destructive-foreground shadow-hard-sm",
        // Outline - Industrial border
        outline: "border-foreground bg-transparent text-foreground",
        // Muted - Subtle tag
        muted: "border-border bg-muted text-muted-foreground",
        // Success
        success: "border-[hsl(142_50%_40%)] bg-[hsl(142_50%_40%)] text-white shadow-hard-sm",
        // Warning
        warning: "border-[hsl(38_80%_55%)] bg-[hsl(38_80%_55%)] text-[hsl(30_8%_12%)] shadow-hard-sm",
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
