'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const TUTORIALS = [
  {
    id: 'xp',
    title: 'Earn XP',
    emoji: '⭐',
    description: 'Gain XP for every correct answer. Answer all questions to boost your XP!',
  },
  {
    id: 'hearts',
    title: 'Hearts System',
    emoji: '❤️',
    description: 'You start each lesson with 3 hearts. Lose a heart on wrong answers. Game over at 0!',
  },
  {
    id: 'streak',
    title: 'Daily Streak',
    emoji: '🔥',
    description: 'Complete lessons daily to build your streak and stay motivated!',
  },
];

export function TutorialScreen() {
  const { nextStep } = useOnboarding();
  const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);

  const tutorial = TUTORIALS[currentTutorialIndex];
  const isLastTutorial = currentTutorialIndex === TUTORIALS.length - 1;

  const handleNext = () => {
    if (isLastTutorial) {
      nextStep();
    } else {
      setCurrentTutorialIndex(currentTutorialIndex + 1);
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  return (
    <Card className="w-full p-8">
      <div className="text-center">
        <div className="text-8xl mb-8 animate-bounce">{tutorial.emoji}</div>
        <h2 className="text-3xl font-extrabold text-foreground mb-4">{tutorial.title}</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto font-medium">{tutorial.description}</p>

        <div className="flex gap-3 justify-center mb-12">
          {TUTORIALS.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                idx === currentTutorialIndex ? "w-10 bg-primary" : "w-3 bg-border"
              )}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSkip} variant="ghost" className="flex-1">
            Skip
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
            variant="primary"
          >
            {isLastTutorial ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
