import { CodeLessonGame } from "@/components/code-lesson-game";
import LessonContent from "@/components/questions/LessonContent";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";


export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600">Loading lesson...</p>
          </Card>
        </div>
      }
    >
      <CodeLessonGame lessonId={lessonId} />
    </Suspense>
  );
}
