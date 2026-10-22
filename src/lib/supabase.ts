import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { externalSupabaseConfig } from "./external-supabase-config";

// Deliberately independent of Cloud environment variables and preview auth storage.
export const supabase = createClient<Database>(
  externalSupabaseConfig.url,
  externalSupabaseConfig.anonKey,
  {
    auth: {
      storageKey: externalSupabaseConfig.storageKey,
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
      detectSessionInUrl: typeof window !== "undefined",
    },
  },
);