import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface Answer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: string;
  content: string;
  explanation: string | null;
  answer: string;
}

interface Lesson {
  id: string;
  title: string;
  questions: Question[];
  unit: {
    id: string;
    title: string;
  };
}

interface LessonSummaryProps {
  lesson: Lesson;
  answers: Answer[];
  languageId: string | null;
  lessonId: string;
}

export default function LessonSummary({
  lesson,
  answers,
  languageId,
  lessonId,
}: LessonSummaryProps) {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctCount / answers.length) * 100);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Lesson Complete!</h1>
          <p className="text-gray-600">{lesson.title}</p>
        </div>

        {/* Score Card */}
        <Card className="p-8 mb-6 text-center bg-linear-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <div className="text-6xl font-bold text-indigo-600 mb-2">{percentage}%</div>
          <p className="text-lg text-gray-700 mb-4">
            {correctCount} out of {answers.length} correct
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-linear-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {percentage >= 80
              ? '🌟 Excellent work!'
              : percentage >= 60
                ? '👍 Good effort!'
                : '💪 Keep practicing!'}
          </p>
        </Card>

        {/* Questions Review */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Review</h2>
          <div className="space-y-3">
            {lesson.questions.map((question, idx) => {
              const answer = answers.find((a) => a.questionId === question.id);
              return (
                <Card key={question.id} className="p-4 border-l-4 border-gray-200">
                  <div className="flex items-start gap-3">
                    {answer?.isCorrect ? (
                      <CheckCircle size={24} className="text-green-500 shrink-0 mt-1" />
                    ) : (
                      <XCircle size={24} className="text-red-500 shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Question {idx + 1}: {question.type.replace(/_/g, ' ')}
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
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => (window.location.href = `/lessons/${lessonId}?languageId=${languageId}`)}
            variant="outline"
            className="flex-1"
          >
            Retry Lesson
          </Button>
          <Button
            onClick={() => (window.location.href = `/chapters?languageId=${languageId}`)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Chapters
          </Button>
        </div>
      </div>
    </div>
  );
}
