/**
 * Supabase Admin Client
 * Used for admin-only operations with service role key
 * NEVER expose this key to the browser
 * Only use in API routes and server-side code
 */

import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
