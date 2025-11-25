'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';

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
      <Card className="w-full max-w-2xl p-8 text-center">
        <p className="text-gray-600">Loading placement test...</p>
      </Card>
    );
  }

  if (questions.length === 0) {
    // No questions, skip to next step
    return (
      <Card className="w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to code?</h2>
        <p className="text-gray-600 mb-8">Let's set up your avatar and you're all set!</p>
        <Button onClick={nextStep} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
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
    <Card className="w-full max-w-2xl p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Quick Placement Test</h2>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.content}</h3>

        <div className="space-y-3">
          {choices.map((choice: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswerQuestion(choice)}
              className={`w-full p-4 border-2 rounded-lg transition text-left font-medium ${
                answers[currentQuestion.id] === choice
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-600'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {isLastQuestion && hasAnsweredAll && (
          <Button
            onClick={handleComplete}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Complete Test
          </Button>
        )}
        {showSkip && (
          <Button onClick={handleSkip} variant="outline" className="flex-1">
            Skip Test
          </Button>
        )}
      </div>
    </Card>
  );
}
