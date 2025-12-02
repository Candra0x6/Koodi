'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button, Card } from '@/components/duolingo-ui';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function WelcomeScreen() {
  const { updateState, goToStep } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    goToStep('signup');
  };

  const handleContinueAsGuest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create guest user via API
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create guest account');
      }

      const data = await res.json();

      // Sign in as guest using NextAuth
      const signInResult = await signIn('guest', {
        userId: data.userId,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Failed to sign in as guest');
      }

      // Update onboarding state and skip signup
      updateState({ 
        authMethod: 'guest',
        userId: data.userId,
      });
      
      // Skip signup screen, go directly to language selection
      goToStep('language');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full p-12 text-center">
      <div className="text-6xl mb-6 animate-bounce">👋</div>
      <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">Welcome to Koodi!</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto font-medium">
        Learn to code with fun, interactive lessons and gamified challenges. Start your coding journey today!
      </p>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={handleGetStarted}
          size="lg"
          variant="super"
          className="w-full sm:w-auto px-12 text-lg"
        >
          Let's Get Started
        </Button>
        
     
      </div>
    </Card>
  );
}
