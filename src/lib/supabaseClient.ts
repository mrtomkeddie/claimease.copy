import { createClient } from '@supabase/supabase-js';

// Ensure the environment variables are not undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are not defined in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
