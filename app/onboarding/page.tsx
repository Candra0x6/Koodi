'use client';

import { OnboardingProvider, useOnboarding } from '@/lib/contexts/onboarding-context';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { WelcomeScreen } from '@/components/onboarding/screens/welcome-screen';
import { SignupScreen } from '@/components/onboarding/screens/signup-screen';
import { LanguageScreen } from '@/components/onboarding/screens/language-screen';
import { GoalScreen } from '@/components/onboarding/screens/goal-screen';
import { PlacementTestScreen } from '@/components/onboarding/screens/placement-screen';
import { AvatarScreen } from '@/components/onboarding/screens/avatar-screen';
import { TutorialScreen } from '@/components/onboarding/screens/tutorial-screen';
import { CompleteScreen } from '@/components/onboarding/screens/complete-screen';

function OnboardingContent() {
  const { state } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full mb-8">
        <OnboardingStepper />
      </div>

      <div className="flex-1 w-full max-w-4xl">
        {state.currentStep === 'welcome' && <WelcomeScreen />}
        {state.currentStep === 'signup' && <SignupScreen />}
        {state.currentStep === 'language' && <LanguageScreen />}
        {state.currentStep === 'goal' && <GoalScreen />}
        {state.currentStep === 'placement' && <PlacementTestScreen />}
        {state.currentStep === 'avatar' && <AvatarScreen />}
        {state.currentStep === 'tutorial' && <TutorialScreen />}
        {state.currentStep === 'complete' && <CompleteScreen />}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
