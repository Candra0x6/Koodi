'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  prompt: string;
  correctAnswer: any;
  explanation?: string;
  questionType: string;
}

interface FeedbackPanelProps {
  question: Question;
  isCorrect: boolean;
  userAnswer: any;
  feedback: string;
  onNext: () => void;
}

export function FeedbackPanel({
  question,
  isCorrect,
  userAnswer,
  feedback,
  onNext,
}: FeedbackPanelProps) {
  return (
    <Card className="p-8 mb-6 bg-white">
      <div className="mb-6">
        {/* Result Header */}
        <div className="flex items-center gap-3 mb-6">
          {isCorrect ? (
            <>
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-2xl font-bold text-green-600">Correct!</h3>
                <p className="text-sm text-gray-600">Great job!</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-2xl font-bold text-red-600">Incorrect</h3>
                <p className="text-sm text-gray-600">Don't worry, keep trying!</p>
              </div>
            </>
          )}
        </div>

        {/* Your Answer */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </p>
          <p className="text-gray-800 font-mono">
            {typeof userAnswer === 'object'
              ? JSON.stringify(userAnswer)
              : String(userAnswer)}
          </p>
        </div>

        {/* Correct Answer */}
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-700 mb-2">
            Correct Answer:
          </p>
          <p className="text-green-800 font-mono">
            {typeof question.correctAnswer === 'object'
              ? JSON.stringify(question.correctAnswer)
              : String(question.correctAnswer)}
          </p>
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-2">
              Explanation:
            </p>
            <p className="text-blue-900">{question.explanation}</p>
          </div>
        )}

        {/* Feedback from API */}
        {feedback && (
          <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-700 mb-2">
              Feedback:
            </p>
            <p className="text-indigo-900">{feedback}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        Next Question
      </Button>
    </Card>
  );
}
