'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OnboardingStep =
  | 'welcome'
  | 'signup'
  | 'language'
  | 'goal'
  | 'placement'
  | 'avatar'
  | 'tutorial'
  | 'complete';

export type LearningGoal = 'BEGINNER' | 'IMPROVE' | 'INTERVIEW';

export interface OnboardingState {
  currentStep: OnboardingStep;
  email?: string;
  password?: string;
  authMethod?: 'email' | 'google' | 'guest';
  selectedLanguageId?: string;
  selectedLanguageName?: string;
  learningGoal?: LearningGoal;
  placementTestScore?: number;
  placementTestAnswers?: Record<string, string>;
  selectedAvatarId?: string;
  userId?: string;
}

interface OnboardingContextType {
  state: OnboardingState;
  goToStep: (step: OnboardingStep) => void;
  updateState: (updates: Partial<OnboardingState>) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STEP_ORDER: OnboardingStep[] = [
  'welcome',
  'signup',
  'language',
  'goal',
  'placement',
  'avatar',
  'tutorial',
  'complete',
];

const initialState: OnboardingState = {
  currentStep: 'welcome',
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

  const goToStep = (step: OnboardingStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      goToStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      goToStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const resetOnboarding = () => {
    setState(initialState);
  };

  const value: OnboardingContextType = {
    state,
    goToStep,
    updateState,
    nextStep,
    previousStep,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
