'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button, Card } from '@/components/duolingo-ui';
import { cn } from '@/lib/utils';

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
    <Card className="w-full p-8">
      <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center">Choose Your Avatar</h2>
      <p className="text-muted-foreground mb-8 text-center font-medium">Pick a character to represent you on your journey</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleSelectAvatar(avatar.id)}
            className={cn(
              "p-6 rounded-2xl border-2 border-b-4 transition-all text-center group",
              state.selectedAvatarId === avatar.id
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted/50 active:border-b-2 active:translate-y-[2px]"
            )}
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-200">{avatar.emoji}</div>
            <div className="font-bold text-foreground text-lg">{avatar.name}</div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!state.selectedAvatarId}
        className="w-full"
        variant="primary"
        size="lg"
      >
        Continue
      </Button>
    </Card>
  );
}
