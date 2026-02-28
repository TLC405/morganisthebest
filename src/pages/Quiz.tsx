import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { quizQuestions } from '@/data/quizQuestions';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Sparkles, Heart } from 'lucide-react';

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentQuestion = quizQuestions[currentStep];
  const isLastStep = currentStep === quizQuestions.length - 1;
  const isFirstStep = currentStep === 0;
  
  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: value,
    }));
  };
  
  const handleNext = () => {
    if (!answers[currentQuestion.key]) {
      toast.error('Please answer the question to continue');
      return;
    }
    
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to save your quiz');
      navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save each answer to quiz_responses
      const responses = Object.entries(answers).map(([key, value]) => ({
        user_id: user.id,
        question_key: key,
        answer_value: value,
      }));
      
      // Upsert responses (update if exists, insert if not)
      for (const response of responses) {
        const { error } = await supabase
          .from('quiz_responses')
          .upsert(response, { onConflict: 'user_id,question_key' });
        
        if (error) throw error;
      }
      
      // Update profile to mark quiz as completed and store personality vector
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          quiz_completed: true,
          personality_vector: answers,
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      toast.success('Profile saved! People you meet at events will see your compatibility.');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b-4 border-primary bg-card">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="text-lg font-bold text-foreground font-mono uppercase tracking-wider">Build Your Profile</span>
          </div>
          <QuizProgress currentStep={currentStep} totalSteps={quizQuestions.length} />
        </div>
      </div>
      
      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-lg p-6 md:p-8 animate-fade-in">
          <QuizQuestion
            question={currentQuestion}
            value={answers[currentQuestion.key]}
            onChange={handleAnswer}
          />
        </Card>
      </div>
      
      {/* Navigation */}
      <div className="p-4 md:p-6 border-t-4 border-border bg-card">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep}
            className="flex-1 h-12"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.key] || isSubmitting}
            className="flex-1 h-12 shadow-hard-sm hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : isLastStep ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Save Profile
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
