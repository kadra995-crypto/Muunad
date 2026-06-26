import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-only: the service role key bypasses RLS, so this must never be
// imported from client code. Used solely to write orders after a successful
// charge; customers read their own orders back via the anon client + RLS.
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
