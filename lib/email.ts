import "server-only";
import { getResendClient, getFromAddress, getAdminNotificationEmail } from "@/lib/resend";
import {
  renderClientReceiptEmail,
  renderAdminAlertEmail,
  renderClientStatusUpdateEmail,
} from "@/lib/email-templates";
import type { RequestRow } from "@/types/database";

export async function sendClientReceiptEmail(opts: {
  to: string;
  ticketNumber: string;
  description: string;
}) {
  const { subject, html } = renderClientReceiptEmail(opts);
  return getResendClient().emails.send({
    from: getFromAddress(),
    to: opts.to,
    subject,
    html,
  });
}

export async function sendAdminAlertEmail(opts: {
  request: Pick<
    RequestRow,
    | "ticket_number"
    | "description"
    | "client_email"
    | "client_phone"
    | "budget"
    | "category"
    | "condition"
    | "size"
    | "need_by_date"
    | "flexibility"
    | "extra_notes"
    | "reference_image_url"
  >;
}) {
  const { subject, html } = renderAdminAlertEmail(opts);
  return getResendClient().emails.send({
    from: getFromAddress(),
    to: getAdminNotificationEmail(),
    subject,
    html,
  });
}

export async function sendClientStatusUpdateEmail(opts: {
  to: string;
  ticketNumber: string;
  status: RequestRow["status"];
  quotedPrice: string | null;
  adminResponseNotes: string | null;
}) {
  const { subject, html } = renderClientStatusUpdateEmail(opts);
  return getResendClient().emails.send({
    from: getFromAddress(),
    to: opts.to,
    subject,
    html,
  });
}
