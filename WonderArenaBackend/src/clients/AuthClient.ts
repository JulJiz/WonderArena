import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL!
const key = process.env.SUPABASE_PUBLISHABLE_KEY!

export const SupabaseClient = createClient(url, key)
