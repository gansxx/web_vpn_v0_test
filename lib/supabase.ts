import { createClient } from  "@supabase/supabase-js"

// Use NEXT_PUBLIC_ prefix to expose to client-side
export const supabase_url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? (() => { throw new Error('NEXT_PUBLIC_SUPABASE_URL must be string') })();
export const supabase_anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? (() => { throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY must be string') })();

export const supabase = createClient(supabase_url, supabase_anon_key)