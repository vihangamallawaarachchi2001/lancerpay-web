import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServerKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
}

if (!supabaseServerKey) {
  throw new Error(
    "Set SUPABASE_SERVICE_ROLE_KEY for server-side writes, or provide NEXT_PUBLIC_SUPABASE_ANON_KEY as a fallback.",
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServerKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
