'use client';

import { useOnboarding, LearningGoal } from '@/lib/contexts/onboarding-context';
import { Card } from '@/components/duolingo-ui';
import { cn } from '@/lib/utils';

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
    <Card className="w-full p-8">
      <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center">What's Your Goal?</h2>
      <p className="text-muted-foreground mb-8 text-center font-medium">Choose what fits you best</p>

      <div className="space-y-4">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleSelectGoal(goal.id)}
            className={cn(
              "w-full p-6 rounded-2xl border-2 border-border border-b-4 hover:bg-muted/50 active:border-b-2 active:translate-y-[2px] transition-all text-left group flex items-center gap-6",
              "hover:border-primary/50"
            )}
          >
            <div className="text-4xl group-hover:scale-110 transition-transform duration-200">{goal.emoji}</div>
            <div>
              <div className="font-bold text-xl text-foreground mb-1">{goal.label}</div>
              <div className="text-sm text-muted-foreground font-medium">{goal.description}</div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
