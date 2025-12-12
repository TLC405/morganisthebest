import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export interface QuizOption {
  value: string;
  label: string;
  emoji: string;
  description?: string;
}

export interface QuizQuestionData {
  key: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'slider' | 'multi';
  options?: QuizOption[];
  sliderLabels?: { min: string; max: string };
}

interface QuizQuestionProps {
  question: QuizQuestionData;
  value: any;
  onChange: (value: any) => void;
}

export const QuizQuestion = ({ question, value, onChange }: QuizQuestionProps) => {
  if (question.type === 'slider') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{question.title}</h2>
          {question.subtitle && (
            <p className="text-muted-foreground">{question.subtitle}</p>
          )}
        </div>
        
        <div className="px-4 py-8">
          <Slider
            value={[value || 3]}
            onValueChange={(v) => onChange(v[0])}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            <span>{question.sliderLabels?.min}</span>
            <span>{question.sliderLabels?.max}</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={cn(
                'w-10 h-10 rounded-full text-sm font-medium transition-all',
                value === n
                  ? 'bg-primary text-primary-foreground scale-110'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  if (question.type === 'multi') {
    const selectedValues = value || [];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{question.title}</h2>
          {question.subtitle && (
            <p className="text-muted-foreground">{question.subtitle}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => {
                  if (isSelected) {
                    onChange(selectedValues.filter((v: string) => v !== option.value));
                  } else {
                    onChange([...selectedValues, option.value]);
                  }
                }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
              >
                <Checkbox checked={isSelected} className="pointer-events-none" />
                <span className="text-2xl">{option.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Single select (default)
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{question.title}</h2>
        {question.subtitle && (
          <p className="text-muted-foreground">{question.subtitle}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
              value === option.value
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-border hover:border-primary/50 bg-card'
            )}
          >
            <span className="text-4xl">{option.emoji}</span>
            <span className="font-medium text-foreground">{option.label}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground text-center">{option.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
