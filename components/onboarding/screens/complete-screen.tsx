'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { useSession } from 'next-auth/react';
import { Button, Card } from '@/components/duolingo-ui';
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
        router.push(`/dashboard`);
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
    <Card className="w-full p-8">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2">You're All Set!</h2>
        <p className="text-muted-foreground mb-8 font-medium">
          Ready to start learning {state.selectedLanguageName}?
        </p>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 font-bold">
            {error}
          </div>
        )}

        <div className="bg-muted/30 rounded-3xl p-6 mb-8 text-left border-2 border-border">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Language</div>
              <div className="font-extrabold text-foreground text-lg">{state.selectedLanguageName}</div>
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Goal</div>
              <div className="font-extrabold text-foreground text-lg">{state.learningGoal}</div>
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Avatar</div>
              <div className="font-extrabold text-foreground text-2xl">
                {['🧙', '🤖', '👽', '🏴‍☠️', '👨‍🚀', '🤴'][
                  parseInt(state.selectedAvatarId || '0')
                ] || '🧙'}
              </div>
            </div>
            {state.placementTestScore !== undefined && (
              <div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Test Score</div>
                <div className="font-extrabold text-foreground text-lg">{state.placementTestScore}/5</div>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleCreateAccount}
          disabled={loading}
          size="lg"
          variant="super"
          className="w-full py-6 text-lg"
        >
          {loading ? 'Setting up...' : '🚀 Start Learning Now'}
        </Button>
      </div>
    </Card>
  );
}
