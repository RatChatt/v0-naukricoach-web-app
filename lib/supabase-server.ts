import { createClient } from "@supabase/supabase-js"

// Use the environment variables that are available from the Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Supabase URL not found. Please check your environment variables.")
}

if (!supabaseServiceKey) {
  throw new Error("Supabase Service Role Key not found. Please check your environment variables.")
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
