import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider font-mono transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "bg-card text-foreground",
        muted: "bg-muted text-muted-foreground border-muted-foreground",
        success: "bg-[hsl(160_60%_40%)] text-[hsl(0_0%_100%)]",
        warning: "bg-[hsl(38_80%_50%)] text-[hsl(0_0%_100%)]",
        accent: "bg-accent text-accent-foreground",
        premium: "bg-foreground text-background",
        trust: "bg-primary/10 text-primary border-primary",
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
