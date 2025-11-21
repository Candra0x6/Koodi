import { auth } from '@/auth';
import LessonBrowser from '@/components/lesson/LessonBrowser';
import { redirect } from 'next/navigation';

export default async function LessonPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <LessonBrowser user={session.user} />;
}
