import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated visitors away from /admin,
  // but this guards the page too in case it's ever rendered without the
  // middleware running (e.g. certain caching/prefetch edge cases).
  if (!user) {
    redirect("/admin/login");
  }

  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Surface the failure rather than silently rendering an empty dashboard.
    throw new Error(`Failed to load requests: ${error.message}`);
  }

  return <AdminDashboard initialRequests={requests ?? []} adminEmail={user.email ?? ""} />;
}
