'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';

interface GameType {
  id: string;
  name: string;
}

interface OnboardingStepperProps {
  userId: string;
  gameTypes: GameType[];
}

const TOTAL_STEPS = 8;

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const HEAR_ABOUT_OPTIONS = [
  'Google',
  'Social Media',
  'Friend',
  'Blog Post',
  'Advertisement',
  'Other',
];
const GOALS = ['Get a job', 'Pass interview', 'Build projects', 'Learn basics'];

interface OnboardingData {
  accountType: string | null;
  selectedLanguage: string | null;
  hearAbout: string | null;
  hearAboutOther: string | null;
  difficulty: string | null;
  learningReason: string | null;
  learningReasonOther: string | null;
  goals: string[];
  dailyGoal: string | null;
}

export default function OnboardingStepper({
  userId,
  gameTypes,
}: OnboardingStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    accountType: null,
    selectedLanguage: null,
    hearAbout: null,
    hearAboutOther: null,
    difficulty: null,
    learningReason: null,
    learningReasonOther: null,
    goals: [],
    dailyGoal: null,
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAccountType = (type: string) => {
    if (type === 'existing') {
      router.push('/login');
    } else {
      setData({ ...data, accountType: type });
      handleNext();
    }
  };

  const handleSelectLanguage = (languageId: string) => {
    setData({ ...data, selectedLanguage: languageId });
    handleNext();
  };

  const handleHearAbout = (option: string) => {
    if (option === 'Other') {
      setData({ ...data, hearAbout: option });
    } else {
      setData({ ...data, hearAbout: option, hearAboutOther: null });
      handleNext();
    }
  };

  const handleDifficulty = (level: string) => {
    setData({ ...data, difficulty: level.toLowerCase() });
    handleNext();
  };

  const handleLearningReason = (reason: string) => {
    if (reason === 'other') {
      setData({ ...data, learningReason: reason });
    } else {
      setData({ ...data, learningReason: reason, learningReasonOther: null });
      handleNext();
    }
  };

  const handleGoals = (goal: string) => {
    const newGoals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    setData({ ...data, goals: newGoals });
  };

  const handleDailyGoal = (goal: string) => {
    setData({ ...data, dailyGoal: goal });
    handleNext();
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      router.push('/chapters');
    } catch (error) {
      console.error('Onboarding error:', error);
      setIsLoading(false);
    }
  };

  // Step 1: Welcome
  if (currentStep === 1) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome! 👋
          </h1>
          <p className="text-gray-600 mb-8">
            Let's get you started on your coding journey
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => handleAccountType('new')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Get Started
            </Button>
            <Button
              onClick={() => handleAccountType('existing')}
              variant="outline"
              className="w-full"
            >
              Already have an account?
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Step 2: Say Welcome
  if (currentStep === 2) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Let's make it personal! 👨‍💻
          </h2>
          <p className="text-gray-600 mb-8">
            What's your name?
          </p>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
          />
          <Button
            onClick={handleNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Continue
          </Button>
        </div>
      </Card>
    );
  }

  // Step 3: Pick Language
  if (currentStep === 3) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Which programming language? 💻
          </h2>
          <p className="text-gray-600 mb-6">Pick one to get started</p>
          <div className="space-y-3">
          {gameTypes.map((lessons) => (
<Button 
                onClick={() => handleSelectLanguage(lessons.id)}
            >
                {lessons.name}
            </Button>
          ))  }
          </div>
        </div>
      </Card>
    );
  }

  // Step 4: How did you hear about us
  if (currentStep === 4) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How did you hear about us? 🎤
          </h2>
          <p className="text-gray-600 mb-6">We'd love to know!</p>
          <div className="space-y-3">
            {HEAR_ABOUT_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleHearAbout(option)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left font-semibold text-gray-900"
              >
                {option}
              </button>
            ))}
          </div>
          {data.hearAbout === 'Other' && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Tell us more..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={data.hearAboutOther || ''}
                onChange={(e) =>
                  setData({ ...data, hearAboutOther: e.target.value })
                }
              />
              <Button
                onClick={handleNext}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Step 5: Difficulty Level
  if (currentStep === 5) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What's your coding level? 🚀
          </h2>
          <p className="text-gray-600 mb-6">This helps us personalize content</p>
          <div className="space-y-3">
            {DIFFICULTIES.map((level, idx) => (
              <button
                key={level}
                onClick={() => handleDifficulty(level)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left"
              >
                <div className="font-semibold text-gray-900">{level}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {idx === 0 && 'No prior experience'}
                  {idx === 1 && 'Some coding experience'}
                  {idx === 2 && 'Experienced developer'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Step 6: Why Learning
  if (currentStep === 6) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Why are you learning? 🎯
          </h2>
          <p className="text-gray-600 mb-6">Help us understand your goals</p>
          <div className="space-y-3">
            <button
              onClick={() => handleLearningReason('career')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left font-semibold text-gray-900"
            >
              Career growth
            </button>
            <button
              onClick={() => handleLearningReason('hobby')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left font-semibold text-gray-900"
            >
              Personal interest
            </button>
            <button
              onClick={() => handleLearningReason('school')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left font-semibold text-gray-900"
            >
              School project
            </button>
            <button
              onClick={() => handleLearningReason('other')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left font-semibold text-gray-900"
            >
              Other
            </button>
          </div>
          {data.learningReason === 'other' && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Tell us more..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={data.learningReasonOther || ''}
                onChange={(e) =>
                  setData({ ...data, learningReasonOther: e.target.value })
                }
              />
              <Button
                onClick={handleNext}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Step 7: Goals
  if (currentStep === 7) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What do you want to achieve? 🏆
          </h2>
          <p className="text-gray-600 mb-6">Select all that apply</p>
          <div className="space-y-3 mb-6">
            {GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => handleGoals(goal)}
                className={`w-full p-4 border-2 rounded-lg transition text-left font-semibold ${
                  data.goals.includes(goal)
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 ${
                      data.goals.includes(goal)
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300'
                    }`}
                  />
                  {goal}
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={handleNext}
            disabled={data.goals.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </Card>
    );
  }

  // Step 8: Daily Goal
  if (currentStep === 8) {
    return (
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <Stepper steps={TOTAL_STEPS} currentStep={currentStep} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How much time daily? ⏱️
          </h2>
          <p className="text-gray-600 mb-6">
            Set a realistic goal (you can change it anytime)
          </p>
          <div className="space-y-3 mb-6">
            {['5', '10', '15', '20'].map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleDailyGoal(`${minutes}min`)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left font-semibold text-gray-900"
              >
                {minutes} minutes per day
              </button>
            ))}
          </div>
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            {isLoading ? 'Setting up...' : 'Let\'s Go! 🚀'}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
