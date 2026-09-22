import "server-only";
import type { RequestRow } from "@/types/database";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Shared dark/gold shell every transactional email is rendered inside, so
 * all three templates stay visually consistent with the app.
 */
function emailShell(opts: { preheader: string; bodyHtml: string }): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ACCESS Concierge</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0B0B0C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <span style="display:none; max-height:0; overflow:hidden;">${escapeHtml(opts.preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0C; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 520px; background-color:#121214; border:1px solid #27272A; border-radius: 12px; overflow:hidden;">
            <tr>
              <td style="padding: 28px 32px 20px 32px; border-bottom:1px solid #27272A;">
                <span style="font-size:12px; letter-spacing: 2px; color:#D4AF37; font-weight:600;">ACCESS CONCIERGE</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px 32px 32px; color:#F4F4F5; font-size:15px; line-height:1.6;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 32px; border-top:1px solid #27272A; color:#71717A; font-size:12px;">
                ACCESS Concierge · This is an automated message, please don't reply directly to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pill(label: string): string {
  return `<span style="display:inline-block; background-color:#1C1C1F; border:1px solid #27272A; color:#D4AF37; font-size:12px; font-weight:600; padding:4px 10px; border-radius:999px;">${escapeHtml(
    label
  )}</span>`;
}

// ---------------------------------------------------------------------------
// 1. Client receipt email — sent immediately after a new request is submitted
// ---------------------------------------------------------------------------
export function renderClientReceiptEmail(opts: {
  ticketNumber: string;
  description: string;
}): { subject: string; html: string } {
  const subject = `We've received your request — ${opts.ticketNumber}`;
  const bodyHtml = `
    <p style="margin:0 0 16px 0; font-size:18px; font-weight:600; color:#FFFFFF;">Request received</p>
    <p style="margin:0 0 20px 0; color:#A1A1AA;">Thanks for reaching out. Your reference number is below — keep it handy, our team will use it to track your request.</p>
    <div style="margin: 0 0 20px 0;">${pill(opts.ticketNumber)}</div>
    <p style="margin:0 0 8px 0; color:#71717A; font-size:12px; letter-spacing:1px;">WHAT YOU ASKED FOR</p>
    <p style="margin:0 0 20px 0; padding:12px 16px; background-color:#0B0B0C; border:1px solid #27272A; border-radius:8px; color:#D4D4D8;">${escapeHtml(
      opts.description
    )}</p>
    <p style="margin:0; color:#A1A1AA;">One of our team will review your request and follow up by email or WhatsApp with next steps, usually within 24 hours.</p>
  `;
  return { subject, html: emailShell({ preheader: subject, bodyHtml }) };
}

// ---------------------------------------------------------------------------
// 2. Admin alert email — sent to the internal team on every new submission
// ---------------------------------------------------------------------------
export function renderAdminAlertEmail(opts: {
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
}): { subject: string; html: string } {
  const r = opts.request;
  const subject = `New request ${r.ticket_number} — ${r.category || "Uncategorized"}`;

  const row = (label: string, value: string | null) =>
    value
      ? `<tr><td style="padding:6px 0; color:#71717A; font-size:12px; width:140px; vertical-align:top;">${escapeHtml(
          label
        )}</td><td style="padding:6px 0; color:#F4F4F5; font-size:13px;">${escapeHtml(
          value
        )}</td></tr>`
      : "";

  const bodyHtml = `
    <p style="margin:0 0 16px 0; font-size:18px; font-weight:600; color:#FFFFFF;">New request submitted</p>
    <div style="margin: 0 0 20px 0;">${pill(r.ticket_number)}</div>
    <table role="presentation" width="100%" style="margin-bottom:20px;">
      ${row("Client email", r.client_email)}
      ${row("Client phone", r.client_phone)}
      ${row("Category", r.category)}
      ${row("Budget", r.budget)}
      ${row("Size", r.size)}
      ${row("Condition", r.condition)}
      ${row("Need by", r.need_by_date)}
      ${row("Flexibility", r.flexibility)}
    </table>
    <p style="margin:0 0 8px 0; color:#71717A; font-size:12px; letter-spacing:1px;">DESCRIPTION</p>
    <p style="margin:0 0 16px 0; padding:12px 16px; background-color:#0B0B0C; border:1px solid #27272A; border-radius:8px; color:#D4D4D8;">${escapeHtml(
      r.description
    )}</p>
    ${
      r.extra_notes
        ? `<p style="margin:0 0 8px 0; color:#71717A; font-size:12px; letter-spacing:1px;">EXTRA NOTES</p>
    <p style="margin:0 0 16px 0; color:#D4D4D8;">${escapeHtml(r.extra_notes)}</p>`
        : ""
    }
    ${
      r.reference_image_url
        ? `<p style="margin:0 0 20px 0;"><a href="${r.reference_image_url}" style="color:#D4AF37;">View reference image →</a></p>`
        : ""
    }
    <p style="margin:0;"><a href="${APP_URL}/admin" style="display:inline-block; background-color:#D4AF37; color:#0B0B0C; font-weight:600; font-size:13px; padding:10px 18px; border-radius:8px; text-decoration:none;">Open dashboard</a></p>
  `;
  return { subject, html: emailShell({ preheader: subject, bodyHtml }) };
}

// ---------------------------------------------------------------------------
// 3. Client status update email — sent when an admin sends a response/quote
// ---------------------------------------------------------------------------
export function renderClientStatusUpdateEmail(opts: {
  ticketNumber: string;
  status: RequestRow["status"];
  quotedPrice: string | null;
  adminResponseNotes: string | null;
}): { subject: string; html: string } {
  const statusLabels: Record<RequestRow["status"], string> = {
    PENDING: "Pending review",
    IN_REVIEW: "In review",
    QUOTED: "Quote ready",
    FULFILLED: "Fulfilled",
    UNAVAILABLE: "Unavailable",
  };
  const statusLabel = statusLabels[opts.status];
  const subject = `Update on your request ${opts.ticketNumber} — ${statusLabel}`;

  const bodyHtml = `
    <p style="margin:0 0 16px 0; font-size:18px; font-weight:600; color:#FFFFFF;">Your request has an update</p>
    <div style="margin: 0 0 20px 0;">${pill(opts.ticketNumber)} &nbsp; ${pill(statusLabel)}</div>
    ${
      opts.quotedPrice
        ? `<p style="margin:0 0 8px 0; color:#71717A; font-size:12px; letter-spacing:1px;">QUOTED PRICE</p>
    <p style="margin:0 0 20px 0; font-size:20px; font-weight:700; color:#D4AF37;">${escapeHtml(
      opts.quotedPrice
    )}</p>`
        : ""
    }
    ${
      opts.adminResponseNotes
        ? `<p style="margin:0 0 8px 0; color:#71717A; font-size:12px; letter-spacing:1px;">NOTES FROM OUR TEAM</p>
    <p style="margin:0 0 20px 0; padding:12px 16px; background-color:#0B0B0C; border:1px solid #27272A; border-radius:8px; color:#D4D4D8;">${escapeHtml(
      opts.adminResponseNotes
    )}</p>`
        : ""
    }
    <p style="margin:0; color:#A1A1AA;">Reply to this thread on WhatsApp or email if you have any questions — reference ${escapeHtml(
      opts.ticketNumber
    )} so we can pull up your request quickly.</p>
  `;
  return { subject, html: emailShell({ preheader: subject, bodyHtml }) };
}
