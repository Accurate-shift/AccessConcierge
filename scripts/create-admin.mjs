// One-off admin provisioning script.
//
// Usage (credentials are read from the environment at run time — they are
// never written into this file or any other file in the repo):
//
//   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="your-password" npm run create-admin
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to already
// be set in .env.local.

import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: ".env.local" });

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } =
  process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local."
  );
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing ADMIN_EMAIL or ADMIN_PASSWORD. Pass them as env vars, e.g.:\n" +
      '  ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="your-password" npm run create-admin'
  );
  process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true, // skip the confirmation email; this account is created by a trusted operator
});

if (error) {
  console.error("Failed to create admin user:", error.message);
  process.exit(1);
}

console.log(`Admin user created: ${data.user.email} (${data.user.id})`);
console.log("They can now sign in at /admin/login.");
