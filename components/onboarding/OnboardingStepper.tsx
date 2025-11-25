'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Stepper } from '../duolingo-ui';

export default function OnboardingStepper() {
  const { state } = useOnboarding();

  const steps = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'signup', label: 'Sign Up' },
    { id: 'language', label: 'Language' },
    { id: 'goal', label: 'Goal' },
    { id: 'placement', label: 'Test' },
    { id: 'avatar', label: 'Avatar' },
    { id: 'tutorial', label: 'Tutorial' },
  ];

  const stepOrder = steps.map((s) => s.id);
  const currentStepIndex = stepOrder.indexOf(state.currentStep as string) + 1;

  return (
    <div className="w-full">
      <Stepper steps={7} currentStep={currentStepIndex} />
    </div>
  );
}
