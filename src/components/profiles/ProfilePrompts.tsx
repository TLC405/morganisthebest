import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit2, Check, X, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Prompt {
  question: string;
  answer: string;
}

interface ProfilePromptsProps {
  prompts: Prompt[];
  onPromptsChange?: (prompts: Prompt[]) => void;
  editable?: boolean;
  maxPrompts?: number;
}

const defaultPromptQuestions = [
  "My perfect Sunday looks like...",
  "I geek out on...",
  "The way to win me over is...",
  "A life goal of mine is...",
  "I'm looking for someone who...",
  "My most controversial opinion is...",
  "Two truths and a lie...",
  "The best trip I've ever been on...",
  "I'm weirdly attracted to...",
  "My simple pleasures are...",
];

export const ProfilePrompts = ({
  prompts,
  onPromptsChange,
  editable = false,
  maxPrompts = 3,
}: ProfilePromptsProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const availableQuestions = defaultPromptQuestions.filter(
    (q) => !prompts.some((p) => p.question === q)
  );

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(prompts[index].answer);
  };

  const saveEdit = () => {
    if (editingIndex !== null && onPromptsChange) {
      const newPrompts = [...prompts];
      newPrompts[editingIndex] = { ...newPrompts[editingIndex], answer: editValue };
      onPromptsChange(newPrompts);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const deletePrompt = (index: number) => {
    if (onPromptsChange) {
      onPromptsChange(prompts.filter((_, i) => i !== index));
    }
  };

  const addPrompt = () => {
    if (selectedQuestion && newAnswer && onPromptsChange) {
      onPromptsChange([...prompts, { question: selectedQuestion, answer: newAnswer }]);
      setSelectedQuestion('');
      setNewAnswer('');
      setShowAddPrompt(false);
    }
  };

  if (prompts.length === 0 && !editable) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Get to Know Me</h3>
      </div>

      <div className="space-y-3">
        {prompts.map((prompt, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              {editingIndex === index ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-primary">{prompt.question}</p>
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="resize-none"
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {editValue.length}/300
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={saveEdit}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-primary">{prompt.question}</p>
                    {editable && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => startEdit(index)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => deletePrompt(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-foreground">{prompt.answer}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add new prompt section */}
        {editable && prompts.length < maxPrompts && (
          <>
            {showAddPrompt ? (
              <Card className="border-primary/30 border-dashed bg-primary/5">
                <CardContent className="p-4 space-y-3">
                  <Label className="text-sm font-medium">Choose a prompt</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableQuestions.slice(0, 6).map((q) => (
                      <Badge
                        key={q}
                        variant="outline"
                        className={cn(
                          'cursor-pointer transition-all',
                          selectedQuestion === q
                            ? 'bg-primary/20 text-primary border-primary'
                            : 'hover:bg-muted'
                        )}
                        onClick={() => setSelectedQuestion(q)}
                      >
                        {q.substring(0, 30)}...
                      </Badge>
                    ))}
                  </div>

                  {selectedQuestion && (
                    <>
                      <p className="text-sm font-medium text-primary mt-3">{selectedQuestion}</p>
                      <Textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Your answer..."
                        className="resize-none"
                        maxLength={300}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {newAnswer.length}/300
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowAddPrompt(false);
                              setSelectedQuestion('');
                              setNewAnswer('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={addPrompt} disabled={!newAnswer.trim()}>
                            Add Prompt
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
                onClick={() => setShowAddPrompt(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Add a Prompt ({prompts.length}/{maxPrompts})
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
