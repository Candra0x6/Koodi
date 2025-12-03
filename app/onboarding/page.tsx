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
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const stepMessages: Record<string, string> = {
  welcome: "Welcome! Let's begin your coding journey.",
  signup: "Create an account to save your progress.",
  language: "Pick a programming language to learn.",
  goal: "How much time can you spend daily?",
  placement: "Let's assess your current skills.",
  avatar: "Customize your profile avatar.",
  tutorial: "Learn how the platform works.",
  complete: "You're ready to go!"
};

function OnboardingContent() {
  const { state } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-8">
        <OnboardingStepper />
      </div>
      <div className="flex w-full justify-start items-center max-w-4xl gap-8 mb-8 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, scale: 1, x: -1, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0, 
              rotate: 0,
            }}
            exit={{ opacity: 0, scale: 1, x: -100, rotate: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15
            }}
            className="shrink-0 cursor-pointer z-10"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ 
                duration: 3 ,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image 
                src="/15.png" 
                alt="Onboarding Illustration" 
                width={200} 
                height={200}
                className="drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep + "-text"}
            initial={{ opacity: 0, scale: 0.8, x: -20, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20, rotate: 2 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.5, delay: 0.1 }}
            className="relative bg-orange-50 border-2 border-primary p-6 rounded-2xl shadow-lg max-w-md"
          >
            {/* Speech bubble tail */}
            <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-r-[14px] border-r-primary" />
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[12px] border-r-orange-50" />
            
            <motion.h1 
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {stepMessages[state.currentStep] || "Let's get started!"}
            </motion.h1>
          </motion.div>
        </AnimatePresence>
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
