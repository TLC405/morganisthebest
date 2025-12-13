import { cn } from '@/lib/utils';

interface HingePromptProps {
  question: string;
  answer: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export const HingePrompt = ({ 
  question, 
  answer, 
  className,
  variant = 'default' 
}: HingePromptProps) => {
  return (
    <div className={cn("prompt-card", className)}>
      <p className={cn(
        "text-muted-foreground uppercase tracking-wide mb-1",
        variant === 'compact' ? 'text-[10px]' : 'text-xs'
      )}>
        {question}
      </p>
      <p className={cn(
        "text-foreground font-medium",
        variant === 'compact' ? 'text-sm' : 'text-base'
      )}>
        {answer}
      </p>
    </div>
  );
};

// Preset prompt questions for Hinge-style profiles
export const HINGE_PROMPTS = [
  "I geek out on...",
  "My simple pleasures are...",
  "A life goal of mine is...",
  "I'm looking for someone who...",
  "My ideal first date would be...",
  "The way to win me over is...",
  "I'm convinced that...",
  "My most irrational fear is...",
  "The one thing I'd love to know about you is...",
  "Two truths and a lie...",
  "I want someone who...",
  "My love language is...",
  "Together, we could...",
  "I'll fall for you if...",
  "Typical Sunday looks like...",
];
