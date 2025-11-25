'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AVATARS = [
  { id: '1', name: 'Wizard', emoji: '🧙' },
  { id: '2', name: 'Robot', emoji: '🤖' },
  { id: '3', name: 'Alien', emoji: '👽' },
  { id: '4', name: 'Pirate', emoji: '🏴‍☠️' },
  { id: '5', name: 'Astronaut', emoji: '👨‍🚀' },
  { id: '6', name: 'Knight', emoji: '🤴' },
];

export function AvatarScreen() {
  const { state, updateState, nextStep } = useOnboarding();

  const handleSelectAvatar = (avatarId: string) => {
    updateState({ selectedAvatarId: avatarId });
  };

  const handleContinue = () => {
    if (state.selectedAvatarId) {
      nextStep();
    }
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Avatar</h2>
      <p className="text-gray-600 mb-8">Pick a character to represent you on your journey</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleSelectAvatar(avatar.id)}
            className={`p-6 rounded-lg border-2 transition text-center ${
              state.selectedAvatarId === avatar.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-600'
            }`}
          >
            <div className="text-5xl mb-2">{avatar.emoji}</div>
            <div className="font-semibold text-gray-900 text-sm">{avatar.name}</div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!state.selectedAvatarId}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
      >
        Continue
      </Button>
    </Card>
  );
}
