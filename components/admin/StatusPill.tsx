import type { RequestStatus } from "@/types/database";

const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "Pending",
  IN_REVIEW: "In review",
  QUOTED: "Quoted",
  FULFILLED: "Fulfilled",
  UNAVAILABLE: "Unavailable",
};

const STATUS_CLASSES: Record<RequestStatus, string> = {
  PENDING: "border-zinc-600 text-zinc-300",
  IN_REVIEW: "border-zinc-500 text-zinc-200",
  QUOTED: "border-access-accent/60 text-access-accent",
  FULFILLED: "border-access-accent text-access-accent bg-access-accent/10",
  UNAVAILABLE: "border-red-500/50 text-red-400",
};

export default function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
