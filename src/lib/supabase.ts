import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dobbjbvqgvnhmvoxhtjk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYmJqYnZxZ3ZuaG12b3hodGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTYwOTEsImV4cCI6MjA5MDQ5MjA5MX0.47Owzv70fuE1IGuOE9l7IFp2J3jg0feGyHpDBg9v6Sk";

if (!SUPABASE_URL || SUPABASE_URL === "https://dobbjbvqgvnhmvoxhtjk.supabase.co") {
  console.warn("⚠️ Supabase URL not configured. Update src/lib/supabase.ts with your project credentials.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
