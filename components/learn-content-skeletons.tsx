import { Loader2 } from "lucide-react"

/**
 * Loading shell for learn content - renders immediately while data streams in
 * Shows the page structure without data
 */
export function LearnContentSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-32 w-full">
      <div className="max-w-full mx-auto bg-background min-h-screen relative">
        {/* Sticky Chapter Header Skeleton */}
        <div className="sticky top-10 z-40">
          <div className="rounded-xl w-full p-5 h-22 bg-muted border-b-4 border-border animate-pulse" />
        </div>

        {/* Units Loading Skeleton */}
        <div className="py-8 relative z-0 space-y-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-10 space-y-8">
              <div className="h-6 bg-muted rounded-lg w-40 animate-pulse" />
              <div className="flex justify-center">
                <div className="w-80 h-96 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Error fallback for learn content
 */
export function LearnContentError({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-depth transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

/**
 * No language selected state
 */
export function NoLanguageSelected() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🌍</div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Language Selected</h2>
        <p className="text-muted-foreground mb-4">Please complete onboarding to select a language.</p>
        <button
          onClick={() => (window.location.href = "/onboarding")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-depth transition-colors"
        >
          Start Onboarding
        </button>
      </div>
    </div>
  )
}

/**
 * No chapters found state
 */
export function NoChaptersFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Lessons Found</h2>
        <p className="text-muted-foreground">The learning path hasn&apos;t been set up yet.</p>
      </div>
    </div>
  )
}
