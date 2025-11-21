'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuestionRenderer } from '@/components/lesson/QuestionRenderer';
import { FeedbackPanel } from '@/components/lesson/FeedbackPanel';
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
  choices?: any;
}

interface UnitStats {
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
}

type PageState = 'loading' | 'playing' | 'feedback' | 'complete' | 'error';

export default function UnitQuizPage({
  params,
}: {
  params: { unitId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get('chapterId');

  const [state, setState] = useState<PageState>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [stats, setStats] = useState<UnitStats>({
    correctCount: 0,
    totalQuestions: 0,
    xpEarned: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUnitQuestions();
    }
  }, [status, params.unitId]);

  const fetchUnitQuestions = async () => {
    try {
      setState('loading');
      const response = await fetch(
        `/api/unit/${params.unitId}/questions?count=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setStats({
        correctCount: 0,
        totalQuestions: data.questions.length,
        xpEarned: 0,
      });
      setCurrentQuestionIdx(0);
      setUserAnswer(null);
      setState('playing');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load questions'
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

  const handleSubmitAnswer = async () => {
    if (!question || userAnswer === null) return;

    setState('loading');
    const correct = evaluateAnswer();
    const xpEarned = correct ? 10 : 0;

    setIsCorrect(correct);

    if (!correct) {
      setHearts((prev) => Math.max(0, prev - 1));
    }

    setXp((prev) => prev + xpEarned);
    setFeedback(
      correct
        ? 'Great job! You got it right!'
        : 'Oops! That\'s not quite right. Check the explanation.'
    );

    setStats((prev) => ({
      correctCount: prev.correctCount + (correct ? 1 : 0),
      totalQuestions: prev.totalQuestions,
      xpEarned: prev.xpEarned + xpEarned,
    }));

    setState('feedback');
  };

  const handleNextQuestion = () => {
    if (hearts <= 0 || currentQuestionIdx >= questions.length - 1) {
      setState('complete');
    } else {
      setCurrentQuestionIdx((prev) => prev + 1);
      setUserAnswer(null);
      setIsCorrect(null);
      setState('playing');
    }
  };

  if (status === 'loading' || state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <Card className="p-8 max-w-md">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <Link href={`/chapter-setup`}>
            <Button className="mt-4 w-full">Back to Chapter</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestionIdx];
  const progressPercent =
    ((currentQuestionIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/chapter-setup`}>
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
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              Correct: {stats.correctCount}
            </span>
          </div>
          <ProgressBar value={progressPercent} color="bg-green-600" />
        </Card>

        {/* Question */}
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
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Submit Answer
              </Button>
            </div>
          </Card>
        )}

        {/* Feedback */}
        {state === 'feedback' && question && (
          <FeedbackPanel
            question={question}
            isCorrect={isCorrect!}
            userAnswer={userAnswer}
            feedback={feedback}
            onNext={handleNextQuestion}
          />
        )}

        {/* Complete Screen */}
        {state === 'complete' && (
          <Card className="p-8 bg-white text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Unit Complete!
            </h2>
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.correctCount}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.totalQuestions - stats.correctCount}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.xpEarned}
                </div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href={`/chapter-setup`} className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Next Unit
                </Button>
              </Link>
              <Link href="/chapters" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Chapters
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
