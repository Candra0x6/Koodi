'use client';

import { useOnboarding, LearningGoal } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const GOALS: { id: LearningGoal; label: string; description: string; emoji: string }[] = [
  {
    id: 'BEGINNER',
    label: 'Learn from Zero',
    description: 'I have no coding experience',
    emoji: '🚀',
  },
  {
    id: 'IMPROVE',
    label: 'Improve Skills',
    description: 'I know some coding already',
    emoji: '📈',
  },
  {
    id: 'INTERVIEW',
    label: 'Prepare for Interviews',
    description: 'Get interview-ready',
    emoji: '💼',
  },
];

export function GoalScreen() {
  const { updateState, nextStep } = useOnboarding();

  const handleSelectGoal = (goal: LearningGoal) => {
    updateState({ learningGoal: goal });
    nextStep();
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">What's Your Goal?</h2>
      <p className="text-gray-600 mb-8">Choose what fits you best</p>

      <div className="space-y-3">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleSelectGoal(goal.id)}
            className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{goal.emoji}</div>
              <div>
                <div className="font-bold text-lg text-gray-900">{goal.label}</div>
                <div className="text-sm text-gray-600">{goal.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
