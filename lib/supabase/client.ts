/**
 * Supabase Client - Browser Client
 * Used for client-side authentication and data operations
 * Safe to use in the browser (uses anon key)
 */

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
