"use client";

import { useState, type FormEvent } from "react";
import { X, Loader2, Check } from "lucide-react";
import type { RequestRow, RequestStatus } from "@/types/database";
import StatusPill from "@/components/admin/StatusPill";

const STATUS_OPTIONS: RequestStatus[] = [
  "PENDING",
  "IN_REVIEW",
  "QUOTED",
  "FULFILLED",
  "UNAVAILABLE",
];

export default function RequestDetailDrawer({
  request,
  onClose,
  onUpdated,
}: {
  request: RequestRow;
  onClose: () => void;
  onUpdated: (updated: RequestRow) => void;
}) {
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [quotedPrice, setQuotedPrice] = useState(request.quoted_price || "");
  const [adminNotes, setAdminNotes] = useState(request.admin_response_notes || "");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setJustSent(false);
    setIsSending(true);

    try {
      const response = await fetch("/api/requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: request.id,
          status,
          quoted_price: quotedPrice || null,
          admin_response_notes: adminNotes || null,
          notify_client: true,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Failed to send update.");
        return;
      }

      onUpdated(payload.request);
      setJustSent(true);
      if (payload.warning) {
        setError(payload.warning);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-access-border bg-access-surface">
        <div className="flex items-center justify-between border-b border-access-border px-6 py-5">
          <div>
            <p className="font-mono text-xs text-zinc-500">{request.ticket_number}</p>
            <div className="mt-1.5">
              <StatusPill status={request.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-500 hover:bg-access-black hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-6 py-6">
          {request.reference_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={request.reference_image_url}
              alt="Reference"
              className="max-h-56 w-full rounded-lg border border-access-border object-contain"
            />
          )}

          <DetailBlock label="Description" value={request.description} />

          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Client email" value={request.client_email} />
            <DetailField label="Client phone" value={request.client_phone} />
            <DetailField label="Budget" value={request.budget} />
            <DetailField label="Size" value={request.size} />
            <DetailField label="Category" value={request.category} />
            <DetailField label="Condition" value={request.condition} />
            <DetailField label="Need by" value={request.need_by_date} />
            <DetailField label="Flexibility" value={request.flexibility} />
          </div>

          {request.extra_notes && (
            <DetailBlock label="Extra notes" value={request.extra_notes} />
          )}

          <div className="h-px bg-access-border" />

          <form onSubmit={handleSend} className="space-y-4">
            <p className="text-sm font-medium text-white">Respond to client</p>

            <label className="block">
              <span className="text-sm text-zinc-400">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RequestStatus)}
                className="mt-1.5 w-full rounded-lg border border-access-border bg-access-black px-3.5 py-2.5 text-sm text-white outline-none focus:border-access-accent"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-zinc-400">Quoted price</span>
              <input
                type="text"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                placeholder="KSh 15,000"
                className="mt-1.5 w-full rounded-lg border border-access-border bg-access-black px-3.5 py-2.5 text-sm text-white outline-none focus:border-access-accent"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-400">Response notes</span>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Instructions or details for the client"
                className="mt-1.5 w-full rounded-lg border border-access-border bg-access-black px-3.5 py-2.5 text-sm text-white outline-none focus:border-access-accent"
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {justSent && !error && (
              <p className="flex items-center gap-1.5 text-sm text-access-accent">
                <Check size={14} /> Update sent to client.
              </p>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-access-accent px-5 py-2.5 text-sm font-semibold text-access-black transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSending && <Loader2 size={16} className="animate-spin" />}
              {isSending ? "Sending" : "Send update to client"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm text-zinc-200">{value || "—"}</p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 rounded-lg border border-access-border bg-access-black px-3.5 py-2.5 text-sm text-zinc-200">
        {value}
      </p>
    </div>
  );
}
