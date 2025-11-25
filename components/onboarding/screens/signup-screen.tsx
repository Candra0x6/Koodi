'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export function SignupScreen() {
  const { updateState, nextStep } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'guest' | null>(null);

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
    <Card className="w-full max-w-2xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
      <p className="text-gray-600 mb-8">Choose how you want to join</p>

      <div className="space-y-4 mb-8">
        {/* Email Signup */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Email & Password</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <Button
            onClick={handleEmailSignup}
            disabled={!email || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            Continue with Email
          </Button>
        </div>

        {/* Google Signup */}
        <Button
          onClick={handleGoogleSignup}
          variant="outline"
          className="w-full p-6 text-lg border-2"
        >
          🔵 Continue with Google
        </Button>

        {/* Guest Signup */}
        <Button
          onClick={handleGuestSignup}
          variant="outline"
          className="w-full p-6 text-lg border-2"
        >
          👤 Continue as Guest
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
      </p>
    </Card>
  );
}
