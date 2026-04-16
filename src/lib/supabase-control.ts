import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseControlClient: SupabaseClient | null = null;

export function getSupabaseControl(): SupabaseClient {
  if (supabaseControlClient) {
    return supabaseControlClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase control environment variables are missing.");
  }

  supabaseControlClient = createClient(supabaseUrl, supabaseKey);
  return supabaseControlClient;
}
