import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Privileged Supabase client using the SERVICE ROLE key. This bypasses Row
 * Level Security entirely.
 *
 * SERVER-ONLY. Never import this file from a "use client" component or any
 * code that ships to the browser — the `server-only` import above will throw
 * a build error if that happens by mistake.
 *
 * Use this for:
 *  - Inserting new requests from the public submit API route (so the public
 *    form doesn't need broad insert privileges of its own).
 *  - Admin update operations in /api/requests/update after the caller's
 *    session has been verified as an authenticated admin.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
