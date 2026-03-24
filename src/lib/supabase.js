import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// DEBUG: remove after confirming env vars are available in production
console.log('ENV CHECK:', import.meta.env.VITE_SUPABASE_URL)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase ENV:', { url: supabaseUrl, key: supabaseAnonKey })
  throw new Error('Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
