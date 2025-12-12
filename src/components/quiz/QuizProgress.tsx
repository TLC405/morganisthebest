import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const QuizProgress = ({ currentStep, totalSteps }: QuizProgressProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
