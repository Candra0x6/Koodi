'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button, Card, ProgressBar } from '@/components/duolingo-ui';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PlacementQuestion {
  id: string;
  content: string;
  choices?: string[];
  answer: string;
  explanation?: string;
}

export function PlacementTestScreen() {
  const { updateState, nextStep, state } = useOnboarding();
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(true);

  useEffect(() => {
    // Fetch placement test questions
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/placement-test?languageId=${state.selectedLanguageId}`);
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [state.selectedLanguageId]);

  if (loading) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground font-bold animate-pulse">Loading placement test...</p>
      </Card>
    );
  }

  if (questions.length === 0) {
    // No questions, skip to next step
    return (
      <Card className="w-full p-8 text-center">
        <h2 className="text-3xl font-extrabold text-foreground mb-4">Ready to code?</h2>
        <p className="text-muted-foreground mb-8 font-medium">Let's set up your avatar and you're all set!</p>
        <Button onClick={nextStep} className="w-full" variant="primary">
          Continue
        </Button>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredAll = questions.length === Object.keys(answers).length;

  const handleAnswerQuestion = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (!isLastQuestion) {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
    }
  };

  const handleComplete = () => {
    const score = Object.values(answers).length; // Simple score based on attempted questions
    updateState({
      placementTestScore: score,
      placementTestAnswers: answers,
    });
    nextStep();
  };

  const handleSkip = () => {
    updateState({ placementTestAnswers: answers });
    nextStep();
  };

  const choices = currentQuestion.choices
    ? typeof currentQuestion.choices === 'string'
      ? JSON.parse(currentQuestion.choices)
      : currentQuestion.choices
    : [];

  return (
    <Card className="w-full p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-foreground">Quick Placement Test</h2>
          <span className="text-sm font-bold text-muted-foreground">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <ProgressBar 
          value={currentQuestionIndex + 1} 
          max={questions.length} 
          color="bg-primary"
          className="h-4"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground mb-6">{currentQuestion.content}</h3>

        <div className="space-y-3">
          {choices.map((choice: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswerQuestion(choice)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 border-b-4 transition-all text-left font-bold text-lg",
                answers[currentQuestion.id] === choice
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50 active:border-b-2 active:translate-y-[2px]"
              )}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {showSkip && (
          <Button onClick={handleSkip} variant="ghost" className="flex-1">
            Skip Test
          </Button>
        )}
        {isLastQuestion && hasAnsweredAll && (
          <Button
            onClick={handleComplete}
            className="flex-1"
            variant="primary"
          >
            Complete Test
          </Button>
        )}
      </div>
    </Card>
  );
}
