'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button, Card } from '@/components/duolingo-ui';

export function WelcomeScreen() {
  const { nextStep } = useOnboarding();

  return (
    <Card className="w-full p-12 text-center">
      <div className="text-6xl mb-6 animate-bounce">👋</div>
      <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">Welcome to Koodi!</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto font-medium">
        Learn to code with fun, interactive lessons and gamified challenges. Start your coding journey today!
      </p>
      <Button
        onClick={nextStep}
        size="lg"
        variant="super"
        className="w-full sm:w-auto px-12 text-lg"
      >
        Let's Get Started
      </Button>
    </Card>
  );
}
