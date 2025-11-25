'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CompleteScreen() {
  const { state } = useOnboarding();
  const { data: session } = useSession();
  const languageId = session?.user?.languageId || state.selectedLanguageId;
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    if (state.authMethod === 'guest') {
      setLoading(true);
      try {
        // Create user account from guest
        const res = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: state.email,
            password: state.password,
            authMethod: state.authMethod,
            selectedLanguageId: state.selectedLanguageId,
            learningGoal: state.learningGoal,
            avatarId: state.selectedAvatarId,
            placementTestScore: state.placementTestScore,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to create account');
        }

        const data = await res.json();
        router.push(`/chapters?languageId=${state.selectedLanguageId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    } else {
      // Already logged in, just complete onboarding
      setLoading(true);
      try {
        const res = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedLanguageId: state.selectedLanguageId,
            learningGoal: state.learningGoal,
            avatarId: state.selectedAvatarId,
            placementTestScore: state.placementTestScore,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to complete onboarding');
        }

        router.push(`/chapters?languageId=${state.selectedLanguageId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">You're All Set!</h2>
        <p className="text-gray-600 mb-8">
          Ready to start learning {state.selectedLanguageName}?
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Language</div>
              <div className="font-semibold text-gray-900">{state.selectedLanguageName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Goal</div>
              <div className="font-semibold text-gray-900">{state.learningGoal}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avatar</div>
              <div className="font-semibold text-gray-900">
                {['🧙', '🤖', '👽', '🏴‍☠️', '👨‍🚀', '🤴'][
                  parseInt(state.selectedAvatarId || '0')
                ] || '🧙'}
              </div>
            </div>
            {state.placementTestScore !== undefined && (
              <div>
                <div className="text-sm text-gray-600">Test Score</div>
                <div className="font-semibold text-gray-900">{state.placementTestScore}/5</div>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleCreateAccount}
          disabled={loading}
          size="lg"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg disabled:opacity-50"
        >
          {loading ? 'Setting up...' : '🚀 Start Learning Now'}
        </Button>
      </div>
    </Card>
  );
}
