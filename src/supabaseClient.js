import { createClient } from "@supabase/supabase-js";

// These come from your Supabase project settings (Project Settings > API).
// See README.md for the full setup steps — you'll paste your own values into
// a .env file, these two lines just read them in.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't crash the whole app on a missing .env — surface a clear message instead.
  console.error(
    "Missing Supabase config. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README.md)."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
