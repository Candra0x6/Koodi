import { Suspense } from "react"
import { LearnContent } from "@/components/learn-content"
import { LearnContentSkeleton } from "@/components/learn-content-skeletons"

/**
 * Optimized Dashboard Page with Streaming
 *
 * Performance optimizations:
 * - Server-side cached data fetching (chapters: 2h, user profile: 5m)
 * - Suspense boundaries for partial prerendering + streaming
 * - Static shell renders immediately, dynamic content streams in
 * - Cache-Control headers set at API level for CDN caching
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<LearnContentSkeleton />}>
      <LearnContent />
    </Suspense>
  )
}
