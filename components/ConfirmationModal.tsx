"use client";

import { Check } from "lucide-react";

export default function ConfirmationModal({
  ticketNumber,
  onClose,
}: {
  ticketNumber: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
    >
      <div className="w-full max-w-sm rounded-2xl border border-access-border bg-access-surface p-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-access-accent/10">
          <Check size={22} className="text-access-accent" />
        </div>

        <h2 id="confirmation-heading" className="mt-5 text-lg font-semibold text-white">
          Request received
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Your reference number is
        </p>
        <p className="mt-2 font-mono text-xl tracking-wide text-access-accent">
          {ticketNumber}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          We&rsquo;ve emailed a copy of this to you. Our team will follow up
          by email or WhatsApp with a quote, usually within 24 hours.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-access-border px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-zinc-500"
        >
          Submit another request
        </button>
      </div>
    </div>
  );
}
