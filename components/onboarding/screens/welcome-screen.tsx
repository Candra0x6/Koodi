'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function WelcomeScreen() {
  const { nextStep } = useOnboarding();

  return (
    <Card className="w-full max-w-2xl p-12 bg-linear-to-br from-indigo-50 to-blue-50">
      <div className="text-center">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Koodi!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Learn to code with fun, interactive lessons and gamified challenges. Start your coding journey today!
        </p>
        <Button
          onClick={nextStep}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
        >
          Let's Get Started →
        </Button>
      </div>
    </Card>
  );
}
