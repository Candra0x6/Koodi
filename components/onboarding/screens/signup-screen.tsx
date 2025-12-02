'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function SignupScreen() {
  const { updateState, nextStep } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'guest' | null>(null);
const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

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
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  const handleEmailSignup = () => {
    if (email && password) {
      updateState({ email, password, authMethod: 'email' });
      nextStep();
    }
  };

  const handleGoogleSignup = () => {
    updateState({ authMethod: 'google' });
    nextStep();
  };

  const handleGuestSignup = () => {
    updateState({ authMethod: 'guest' });
    nextStep();
  };

  return (
    <>
  
    <Card className="w-full p-8">
      <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center">Create your profile</h2>
      <p className="text-muted-foreground mb-8 text-center font-medium">Choose how you want to join Koodi</p>

      <div className="space-y-4 mb-8">
        {/* Email Signup */}
        <div className="border-2 border-border rounded-3xl p-6 bg-muted/20">
          <h3 className="font-bold text-foreground mb-4 text-lg">Email & Password</h3>
          <div className="space-y-3 mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={handleEmailSignup}
            disabled={!email || !password}
            className="w-full"
            variant="primary"
          >
            Continue with Email
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Signup */}
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-14 text-base"
          >
            <span className="mr-2">🔵</span> Google
          </Button>

          {/* Guest Signup */}
          <Button
            onClick={handleContinueAsGuest}
            variant="outline"
            className="w-full h-14 text-base"
          >
            <span className="mr-2">👤</span> Guest
          </Button>
        </div>
      </div>

      <p className="text-center text-sm font-bold text-muted-foreground">
        Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
      </p>
     

    </Card>
      
    </>
  );
}
