'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

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
    <Card className="w-full max-w-2xl p-8">
      <div className="text-center">
        <div className="text-6xl mb-6">{tutorial.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{tutorial.title}</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">{tutorial.description}</p>

        <div className="flex gap-2 justify-center mb-8">
          {TUTORIALS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentTutorialIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSkip} variant="outline" className="flex-1">
            Skip
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLastTutorial ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
