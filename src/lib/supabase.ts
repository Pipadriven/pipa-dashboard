import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ Supabase URL not configured. Update src/lib/supabase.ts with your project credentials.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
