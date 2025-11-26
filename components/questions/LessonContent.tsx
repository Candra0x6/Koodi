'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { MultipleChoice } from '@/components/questions/MultipleChoice';
import { FillBlank } from '@/components/questions/FillBlank';
import { CodeOutput } from '@/components/questions/CodeOutput';
import { DebugCode } from '@/components/questions/DebugCode';
import { HeartsDisplay } from '@/components/hearts-display';
import { GameOverModal } from '@/components/game-over-modal';
import { useAuth } from '@/lib/hooks/use-auth';
import { auth } from '@/auth';

// ============================================================================
// Type Definitions
// ============================================================================

type QuestionType = 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'CODE_OUTPUT' | 'DEBUG_CODE';

interface Question {
  readonly id: string;
  readonly type: QuestionType;
  readonly content: string;
  readonly explanation: string | null;
  readonly choices: string[] | string | null;
  readonly answer: string;
  readonly difficulty: number;
}

interface Unit {
  readonly id: string;
  readonly title: string;
}

interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly hearts: number;
  readonly questions: readonly Question[];
  readonly unit: Unit;
}

interface Answer {
  readonly questionId: string;
  readonly userAnswer: string;
  readonly isCorrect: boolean;
}

interface LessonContentProps {
  readonly lessonId: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

const normalizeAnswer = (answer: string): string =>
  answer.toLowerCase().trim();

const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean =>
  normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

const calculatePercentage = (correct: number, total: number): number =>
  total > 0 ? Math.round((correct / total) * 100) : 0;

const getPerformanceMessage = (percentage: number): string => {
  if (percentage === 100) return '🌟 Perfect! Lesson completed!';
  if (percentage >= 80) return '🌟 Excellent work!';
  if (percentage >= 60) return '👍 Good effort!';
  return '💪 Keep practicing!';
};


// ============================================================================
// Component: Loading State
// ============================================================================

const LoadingState = () => (
  <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
    <Card className="p-8 text-center">
      <div className="text-4xl mb-4">📝</div>
      <p className="text-gray-600">Loading lesson...</p>
    </Card>
  </div>
);

// ============================================================================
// Component: Error State
// ============================================================================

interface ErrorStateProps {
  readonly error: string | null;
  readonly languageId: string;
}

const ErrorState = ({ error, languageId }: ErrorStateProps) => {
  const handleBackClick = useCallback(() => {
    window.location.href = `/chapters`;
  }, [languageId]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-gray-600 mb-6">{error || 'Lesson not found'}</p>
        <Button
          onClick={handleBackClick}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Chapters
        </Button>
      </Card>
    </div>
  );
};

// ============================================================================
// Component: Score Card
// ============================================================================

interface ScoreCardProps {
  readonly percentage: number;
  readonly correctCount: number;
  readonly totalCount: number;
  readonly allCorrect: boolean;
}

const ScoreCard = ({
  percentage,
  correctCount,
  totalCount,
  allCorrect,
}: ScoreCardProps) => {
  const colorClass = allCorrect
    ? 'from-green-50 to-emerald-50 border-green-200'
    : 'from-indigo-50 to-blue-50 border-indigo-200';

  const percentageColorClass = allCorrect ? 'text-green-600' : 'text-indigo-600';
  const barColorClass = allCorrect
    ? 'bg-linear-to-r from-green-500 to-emerald-500'
    : 'bg-linear-to-r from-indigo-500 to-blue-500';

  return (
    <Card className={`p-8 mb-6 text-center bg-linear-to-br border-2 ${colorClass}`}>
      <div className={`text-6xl font-bold mb-2 ${percentageColorClass}`}>
        {percentage}%
      </div>
      <p className="text-lg text-gray-700 mb-4">
        {correctCount} out of {totalCount} correct
      </p>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">{getPerformanceMessage(percentage)}</p>
    </Card>
  );
};

// ============================================================================
// Component: Question Review Item
// ============================================================================

interface QuestionReviewItemProps {
  readonly question: Question;
  readonly answer: Answer | undefined;
  readonly index: number;
}

const QuestionReviewItem = ({
  question,
  answer,
  index,
}: QuestionReviewItemProps) => {
  const Icon = answer?.isCorrect ? CheckCircle : XCircle;
  const iconColor = answer?.isCorrect ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="p-4 border-l-4 border-gray-200">
      <div className="flex items-start gap-3">
        <Icon size={24} className={`${iconColor} shrink-0 mt-1`} />
        <div className="flex-1">
          <p className="font-medium text-gray-900">
            Question {index + 1}: {question.type.replace(/_/g, ' ')}
          </p>
          <p className="text-sm text-gray-600 mt-1">{question.content}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-700">
              <strong>Your answer:</strong> {answer?.userAnswer}
            </p>
            {!answer?.isCorrect && (
              <p className="text-gray-700">
                <strong>Correct answer:</strong> {question.answer}
              </p>
            )}
            {question.explanation && (
              <p className="text-gray-700">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// Component: Question Review Section
// ============================================================================

interface QuestionReviewProps {
  readonly lesson: Lesson;
  readonly answers: readonly Answer[];
}

const QuestionReview = ({ lesson, answers }: QuestionReviewProps) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Review</h2>
    <div className="space-y-3">
      {lesson.questions.map((question, idx) => {
        const answer = answers.find((a) => a.questionId === question.id);
        return (
          <QuestionReviewItem
            key={question.id}
            question={question}
            answer={answer}
            index={idx}
          />
        );
      })}
    </div>
  </div>
);

// ============================================================================
// Component: Lesson Summary
// ============================================================================

interface LessonSummaryProps {
  readonly lesson: Lesson;
  readonly answers: readonly Answer[];
  readonly languageId: string;
  readonly lessonId: string;
}

interface CompletionData {
  readonly xpEarned: number;
  readonly streak: number;
  readonly streakMultiplier: number;
}

const LessonSummary = ({
  lesson,
  answers,
  languageId,
  lessonId,
}: LessonSummaryProps) => {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = calculatePercentage(correctCount, answers.length);
  const allCorrect = correctCount === answers.length;

  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [loading, setLoading] = useState(false);

  // Mark lesson as complete when all answers are correct
  useEffect(() => {
    if (!allCorrect) return;

    const completeLesson = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lessons/${lessonId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        });

        if (!response.ok) {
          console.error('Failed to mark lesson complete');
          return;
        }

        const data = (await response.json()) as CompletionData;
        setCompletionData(data);
      } catch (err) {
        console.error('Failed to mark lesson complete:', err);
      } finally {
        setLoading(false);
      }
    };

    void completeLesson();
  }, [allCorrect, lessonId]);

  const handleRetryClick = useCallback(() => {
    window.location.href = `/lessons/${lessonId}`;
  }, [lessonId, languageId]);

  const handleContinueClick = useCallback(() => {
    window.location.href = `/chapters`;
  }, [lessonId, languageId]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎉 Lesson Complete!
          </h1>
          <p className="text-gray-600">{lesson.title}</p>
        </div>

        <ScoreCard
          percentage={percentage}
          correctCount={correctCount}
          totalCount={answers.length}
          allCorrect={allCorrect}
        />

        {allCorrect && completionData && (
          <Card className="p-6 mb-6 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  +{completionData.xpEarned} XP
                </div>
                <p className="text-sm text-gray-600">
                  {completionData.streakMultiplier > 1
                    ? `×${completionData.streakMultiplier} streak bonus!`
                    : 'Base reward'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  🔥 {completionData.streak}
                </div>
                <p className="text-sm text-gray-600">day streak</p>
              </div>
            </div>
          </Card>
        )}

        <QuestionReview lesson={lesson} answers={answers} />

        <div className="flex gap-3">
          {!allCorrect && (
            <Button
              onClick={handleRetryClick}
              variant="outline"
              className="flex-1"
            >
              Retry Lesson
            </Button>
          )}
          <Button
            onClick={handleContinueClick}
            className={`flex-1 ${
              allCorrect
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {allCorrect ? '🎉 Continue' : 'Back to Chapters'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Component: Question Stepper
// ============================================================================

interface QuestionStepperProps {
  readonly currentIndex: number;
  readonly totalQuestions: number;
  readonly answers: readonly Answer[];
  readonly lesson: Lesson;
}

const QuestionStepper = ({
  currentIndex,
  totalQuestions,
  answers,
  lesson,
}: QuestionStepperProps) => (
  <div className="flex items-center justify-between mb-6">
    <div className="text-sm font-medium text-gray-600">
      Question {currentIndex + 1} of {totalQuestions}
    </div>
    <div className="flex gap-1">
      {lesson.questions.map((question, idx) => (
        <div
          key={question.id}
          className={`h-2 w-8 rounded-full transition-all ${
            idx === currentIndex
              ? 'bg-indigo-600'
              : answers.some((a) => a.questionId === question.id)
                ? 'bg-green-500'
                : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  </div>
);

// ============================================================================
// Component: Question Renderer
// ============================================================================

interface QuestionRendererProps {
  readonly currentQuestion: Question;
  readonly onSubmit: (answer: string) => Promise<void>;
  readonly disabled: boolean;
}

const QuestionRenderer = ({
  currentQuestion,
  onSubmit,
  disabled,
}: QuestionRendererProps) => {
  const commonProps = {
    question: {
      id: currentQuestion.id,
      content: currentQuestion.content,
      answer: currentQuestion.answer,
    },
    onSubmit,
    disabled,
  };

  switch (currentQuestion.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <MultipleChoice
          {...commonProps}
          question={{
            ...commonProps.question,
            choices: currentQuestion.choices,
          }}
        />
      );
    case 'FILL_BLANK':
      return <FillBlank {...commonProps} />;
    case 'CODE_OUTPUT':
      return <CodeOutput {...commonProps} />;
    case 'DEBUG_CODE':
      return <DebugCode {...commonProps} />;
    default:
      return <div className="text-red-500">Unknown question type</div>;
  }
};

// ============================================================================
// Component: Answer Feedback
// ============================================================================

interface AnswerFeedbackProps {
  readonly answer: Answer;
  readonly question: Question;
}

const AnswerFeedback = ({ answer, question }: AnswerFeedbackProps) => {
  const isCorrect = answer.isCorrect;

  return (
    <div
      className={`p-4 rounded-lg mb-6 ${
        isCorrect
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      <p
        className={`font-medium mb-2 ${
          isCorrect ? 'text-green-900' : 'text-red-900'
        }`}
      >
        {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
      </p>
      {question.explanation && (
        <p className="text-sm text-gray-700">{question.explanation}</p>
      )}
      {!isCorrect && (
        <p className="text-sm text-gray-700 mt-2">
          <strong>Correct answer:</strong> {question.answer}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// Component: Navigation Controls
// ============================================================================

interface NavigationControlsProps {
  readonly canGoBack: boolean;
  readonly canGoNext: boolean;
  readonly submitted: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

const NavigationControls = ({
  canGoBack,
  canGoNext,
  submitted,
  onPrevious,
  onNext,
}: NavigationControlsProps) => (
  <div className="flex gap-3">
    <Button
      onClick={onPrevious}
      disabled={!canGoBack}
      variant="outline"
      className="flex items-center gap-2"
    >
      <ChevronLeft size={20} />
      Previous
    </Button>
    <div className="flex-1" />
    <Button
      onClick={onNext}
      disabled={!submitted || !canGoNext}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
    >
      Next
      <ChevronRight size={20} />
    </Button>
  </div>
);

// ============================================================================
// Component: Quiz Content
// ============================================================================

interface QuizContentProps {
  readonly lesson: Lesson;
  readonly languageId: string;
  readonly lessonId: string;
  readonly currentIndex: number;
  readonly setCurrentIndex: (index: number) => void;
  readonly answers: readonly Answer[];
  readonly setAnswers: (answers: Answer[]) => void;
  readonly submitted: boolean;
  readonly setSubmitted: (submitted: boolean) => void;
  readonly hearts: number;
  readonly maxHearts: number;
  readonly gameOver: boolean;
  readonly setGameOver: (gameOver: boolean) => void;
  readonly attempts: number;
  readonly setAttempts: (attempts: number | ((prev: number) => number)) => void;
}

const QuizContent = ({
  lesson,
  languageId,
  lessonId,
  currentIndex,
  setCurrentIndex,
  answers,
  setAnswers,
  submitted,
  setSubmitted,
  hearts,
  maxHearts,
  gameOver,
  setGameOver,
  attempts,
  setAttempts,
}: QuizContentProps) => {
  const currentQuestion = lesson.questions[currentIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < lesson.questions.length - 1;

  const handleSubmitAnswer = useCallback(
    async (userAnswer: string): Promise<void> => {
      const isCorrect = isAnswerCorrect(userAnswer, currentQuestion.answer);


      // Update hearts if incorrect
      if (!isCorrect) {
        const newHearts = hearts - 1;

        if (newHearts <= 0) {
          setGameOver(true);
          setAttempts((prev) => prev + 1);
        } else {
          // Note: Hearts would be updated here if needed
          // For now, we just track it in the answer
        }
      }

      // Add answer to list
      setAnswers([
        ...answers,
        {
          questionId: currentQuestion.id,
          userAnswer,
          isCorrect,
        },
      ]);

      setSubmitted(true);
    },
    [
      currentQuestion.id,
      currentQuestion.answer,
      hearts,
      lessonId,
      setAnswers,
      setGameOver,
      setAttempts,
      setSubmitted,
      answers,
    ]
  );

  const handlePrevious = useCallback(() => {
    if (canGoBack) {
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = answers.find(
        (a) => a.questionId === lesson.questions[currentIndex - 1].id
      );
      setSubmitted(!!prevAnswer);
    }
  }, [
    canGoBack,
    currentIndex,
    setCurrentIndex,
    answers,
    lesson.questions,
    setSubmitted,
  ]);

  const handleNext = useCallback(() => {
    if (canGoNext && submitted) {
      setCurrentIndex(currentIndex + 1);
      setSubmitted(false);
    }
  }, [canGoNext, submitted, currentIndex, setCurrentIndex, setSubmitted]);

  const handleBackClick = useCallback(() => {
    window.location.href = `/chapters`;
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-4 text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Chapters
          </Button>
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600">{lesson.unit.title}</p>
            </div>
            <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
          </div>
        </div>

        {/* Quiz Card */}
        <Card className="p-6 mb-6">
          <QuestionStepper
            currentIndex={currentIndex}
            totalQuestions={lesson.questions.length}
            answers={answers}
            lesson={lesson}
          />

          <div className="mb-8">
            <QuestionRenderer
              currentQuestion={currentQuestion}
              onSubmit={handleSubmitAnswer}
              disabled={submitted}
            />
          </div>

          {submitted && currentAnswer && (
            <AnswerFeedback answer={currentAnswer} question={currentQuestion} />
          )}

          <NavigationControls
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            submitted={submitted}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component: Lesson Content
// ============================================================================

export default function LessonContent({
  lessonId,
}: LessonContentProps) {
  const {user} = useAuth()
  const languageId = user?.selectedLanguageId
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [hearts, setHearts] = useState(3);
  const [maxHearts, setMaxHearts] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Load lesson on mount
  useEffect(() => {
    const loadLesson = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}/questions`);
        if (!res.ok) throw new Error('Failed to load lesson');

        const data = await res.json();
        // New API returns questions array directly and lesson info separately
        const lessonData: Lesson = {
          id: data.lesson.id,
          title: data.lesson.title,
          hearts: data.lesson.hearts,
          questions: data.questions || [],
          unit: data.lesson.unit,
        };
        setLesson(lessonData);
        setSessionId(data.sessionId || null);
        setMaxHearts(data.lesson.hearts);
        setHearts(data.lesson.hearts);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    void loadLesson();
  }, [lessonId]);

  if (loading) return <LoadingState />;
  if (error || !lesson) return <ErrorState error={error} languageId={languageId as string} />;
  if (lesson.questions.length === 0) {
    return <ErrorState error="No questions available for this lesson" languageId={languageId as string} />;
  }

  const isLessonComplete = answers.length === lesson.questions.length;
  if (isLessonComplete) {
    return (
      <LessonSummary
        lesson={lesson}
        answers={answers}
        languageId={languageId as string}
        lessonId={lessonId}
      />
    );
  }

  if (gameOver) {
    const handleRetry = (): void => {
      setAnswers([]);
      setCurrentIndex(0);
      setSubmitted(false);
      setGameOver(false);
      setHearts(maxHearts);
      window.location.href = `/lessons/${lessonId}`;
    };

    const handleBack = (): void => {
      window.location.href = `/chapters`;
    };

    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50">
        <GameOverModal
          attempts={attempts + 1}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <QuizContent
      lesson={lesson}
      languageId={languageId as string}
      lessonId={lessonId}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      answers={answers}
      setAnswers={setAnswers}
      submitted={submitted}
      setSubmitted={setSubmitted}
      hearts={hearts}
      maxHearts={maxHearts}
      gameOver={gameOver}
      setGameOver={setGameOver}
      attempts={attempts}
      setAttempts={setAttempts}
    />
  );
}
