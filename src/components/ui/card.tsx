import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        // Default - Cream with soft shadow
        default: "bg-card border border-border shadow-soft",
        // Elevated - Premium shadow depth
        elevated: "bg-card border border-border shadow-elegant hover:shadow-depth-lg",
        // Glass - Frosted cream
        glass: "glass-cream hover:border-primary/20",
        // Champagne - Subtle warm gradient
        champagne: "gradient-champagne border border-border shadow-soft",
        // Trust - Blue accent for verification
        trust: "bg-card border-l-4 border-l-accent border border-border shadow-soft",
        // Feature - For feature cards
        feature: "bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1",
        // Spotlight - Gold accent glow
        spotlight: "bg-card border border-primary/20 shadow-glow",
        // Editorial - Clean minimal
        editorial: "bg-card/90 border border-border/60",
        // Minimal - Ultra-thin borders
        minimal: "bg-transparent border border-border/40",
        // Accent - Gold left border
        accent: "bg-card border border-border border-l-4 border-l-primary shadow-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold leading-tight tracking-tight text-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
