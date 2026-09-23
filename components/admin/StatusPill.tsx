import type { RequestStatus } from "@/types/database";

const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "Pending",
  REVIEWING: "In review",
  QUOTED: "Quoted",
  APPROVED: "Approved",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES: Record<RequestStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  REVIEWING: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  QUOTED: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  IN_PROGRESS: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  COMPLETED: "bg-green-500/10 text-green-300 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-300 border-red-500/20",
};

type StatusPillProps = {
  status: RequestStatus;
};

export default function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}