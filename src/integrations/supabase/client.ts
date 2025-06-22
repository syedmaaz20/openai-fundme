
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sbvwrlbgboosazyclsbz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidndybGJnYm9vc2F6eWNsc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTQ5MTAsImV4cCI6MjA2NTczMDkxMH0.Kwf68Q61wLdVQXhRtRK6lmafsERLLCAvsxarxoXZ2XI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true, // Persist session across browser restarts
    autoRefreshToken: true, // Automatically refresh tokens
    detectSessionInUrl: true, // Detect session from URL (for OAuth)
  },
});
