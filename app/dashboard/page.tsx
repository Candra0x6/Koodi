import { Suspense } from "react"
import { LearnContentSkeleton } from "@/components/learn-content-skeletons"
import { LearnContent } from "@/components/learn-content"

/**
 * Optimized Dashboard Page with Streaming & Partial Prerendering
 *
 * Performance optimizations applied:
 * 1. Server-side cached data fetching:
 *    - Chapters: 2-hour cache (unstable_cache)
 *    - User progress: 5-minute cache (real-time)
 * 2. Suspense boundaries for streaming:
 *    - Static shell renders immediately
 *    - Dynamic content streams in progressively
 * 3. Cache-Control headers on API responses:
 *    - Public: 10 min (600s) + CDN 1 hour
 *    - Private (auth): 5 min (300s) for user-specific data
 * 4. Optimized client components with proper memoization
 * 5. Efficient scroll spy without re-renders
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<LearnContentSkeleton />}>
      <LearnContent />
    </Suspense>
  )
}
