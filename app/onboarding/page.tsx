import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Check if user already completed onboarding
  const onboardingData = await prisma.onboardingData.findUnique({
    where: { userId: session.user.id },
  });

  if (onboardingData?.completed) {
    redirect('/lesson');
  }

  // Fetch available game types for course selection
  const gameTypes = await prisma.gameType.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <OnboardingStepper userId={session.user.id} gameTypes={gameTypes} />
    </div>
  );
}
