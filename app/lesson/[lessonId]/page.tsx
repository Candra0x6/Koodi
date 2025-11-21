'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuestionRenderer } from '@/components/lesson/QuestionRenderer';
import { FeedbackPanel } from '@/components/lesson/FeedbackPanel';
import { LessonComplete } from '@/components/lesson/LessonComplete';
import { ChevronLeft, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  prompt: string;
  codeSnippet?: string;
  correctAnswer: any;
  explanation?: string;
  difficulty: number;
  tags: string[];
  questionType: string;
  targetEloMin?: number;
  targetEloMax?: number;
  choices?: any;
}

interface LessonStats {
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  eloChange: number;
}

type PageState = 'loading' | 'playing' | 'feedback' | 'complete' | 'error';

export default function LessonPlayerPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [question, setQuestion] = useState<Question | null>(null);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [stats, setStats] = useState<LessonStats>({
    correctCount: 0,
    totalQuestions: 0,
    xpEarned: 0,
    eloChange: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNextQuestion();
    }
  }, [status, params.lessonId]);

  // Timer for tracking time spent on question
  useEffect(() => {
    if (state === 'playing') {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state]);

  const fetchNextQuestion = async () => {
    try {
      setState('loading');
      const response = await fetch('/api/next-question');

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      setQuestion(data.data);
      setUserAnswer(null);
      setIsCorrect(null);
      setFeedback('');
      setTimeSpent(0);
      setState('playing');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load question'
      );
      setState('error');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!question || userAnswer === null) return;

    try {
      setState('loading');

      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          isCorrect: evaluateAnswer(),
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const result = await response.json();

      const correct = evaluateAnswer();
      setIsCorrect(correct);

      if (!correct) {
        setHearts((prev) => Math.max(0, prev - 1));
      }

      setXp((prev) => prev + result.xpEarned);
      setFeedback(result.feedback || '');

      setStats((prev) => ({
        correctCount: prev.correctCount + (correct ? 1 : 0),
        totalQuestions: prev.totalQuestions + 1,
        xpEarned: prev.xpEarned + result.xpEarned,
        eloChange: result.userElo ? result.userElo - 1200 : 0,
      }));

      setState('feedback');

      // Check if lesson should end
      if (hearts - (correct ? 0 : 1) === 0) {
        setTimeout(() => {
          setState('complete');
        }, 2000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit answer'
      );
      setState('error');
    }
  };

  const evaluateAnswer = (): boolean => {
    if (!question) return false;

    switch (question.questionType) {
      case 'fix_the_bug':
      case 'code_reorder':
      case 'fill_in_blank':
        return userAnswer === question.correctAnswer;
      case 'predict_output':
        return String(userAnswer).trim() === String(question.correctAnswer).trim();
      default:
        return userAnswer === question.correctAnswer;
    }
  };

  const handleNextQuestion = async () => {
    if (hearts <= 0) {
      setState('complete');
    } else {
      await fetchNextQuestion();
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <Card className="p-8 max-w-md">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <Link href="/lesson">
            <Button className="mt-4 w-full">Back to Lessons</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (state === 'complete') {
    return <LessonComplete stats={stats} />;
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/lesson">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-semibold">{hearts}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{xp}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {stats.totalQuestions + 1}
            </span>
            <span className="text-sm text-gray-500">
              Correct: {stats.correctCount}
            </span>
          </div>
          <ProgressBar 
            value={(stats.correctCount / Math.max(1, stats.totalQuestions + 1)) * 100}
            color="bg-indigo-600"
          />
        </Card>

        {/* Question Renderer or Feedback */}
        {state === 'playing' && question && (
          <Card className="p-8 mb-6 bg-white">
            <QuestionRenderer
              question={question}
              userAnswer={userAnswer}
              onAnswerChange={setUserAnswer}
            />

            <div className="mt-8 flex gap-4">
              <Button
                onClick={handleSubmitAnswer}
                disabled={userAnswer === null}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Submit Answer
              </Button>
            </div>
          </Card>
        )}

        {state === 'feedback' && question && (
          <FeedbackPanel
            question={question}
            isCorrect={isCorrect!}
            userAnswer={userAnswer}
            feedback={feedback}
            onNext={handleNextQuestion}
          />
        )}
      </div>
    </div>
  );
}
