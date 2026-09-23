"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ImageOff } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { RequestRow, RequestStatus } from "@/types/database";
import RequestDetailDrawer from "@/components/admin/RequestDetailDrawer";
import StatusPill from "@/components/admin/StatusPill";

type FilterTab =
  | "All"
  | "Pending"
  | "In Review"
  | "Quoted"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Cancelled";

const FILTER_TABS: { label: FilterTab; status: RequestStatus | null }[] = [
  { label: "All", status: null },
  { label: "Pending", status: "PENDING" },
  { label: "In Review", status: "REVIEWING" },
  { label: "Quoted", status: "QUOTED" },
  { label: "Approved", status: "APPROVED" },
  { label: "In Progress", status: "IN_PROGRESS" },
  { label: "Completed", status: "COMPLETED" },
  { label: "Cancelled", status: "CANCELLED" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard({
  initialRequests,
  adminEmail,
}: {
  initialRequests: RequestRow[];
  adminEmail: string;
}) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestRow[]>(initialRequests);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const filteredRequests = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.label === activeFilter);
    if (!tab || tab.status === null) return requests;
    return requests.filter((r) => r.status === tab.status);
  }, [requests, activeFilter]);

  function handleRequestUpdated(updated: RequestRow) {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRequest(updated);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-access-black">
      <header className="border-b border-access-border px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-access-accent">
              ACCESS CONCIERGE
            </span>
            <p className="mt-1 text-sm text-zinc-500">{adminEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-1.5 rounded-lg border border-access-border px-3.5 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 disabled:opacity-60"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <div className="flex gap-1 border-b border-access-border">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveFilter(tab.label)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeFilter === tab.label
                  ? "border-b-2 border-access-accent text-white"
                  : "border-b-2 border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-access-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-access-border text-xs text-zinc-500">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    <ImageOff size={20} className="mx-auto mb-2 text-zinc-600" />
                    No requests in this view yet.
                  </td>
                </tr>
              )}
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className="cursor-pointer border-b border-access-border text-zinc-300 last:border-0 hover:bg-access-surface"
                >
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                    {request.ticket_number}
                  </td>
                  <td className="px-4 py-3">{request.client_email}</td>
                  <td className="px-4 py-3">{request.category || "—"}</td>
                  <td className="px-4 py-3">{request.budget || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={request.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={handleRequestUpdated}
        />
      )}
    </main>
  );
}
