import "server-only";
import { Resend } from "resend";

let cachedClient: Resend | null = null;

/**
 * Lazily-instantiated Resend client. Instantiating at module load time would
 * throw during `next build` if RESEND_API_KEY isn't set yet in some
 * environments, so we defer until the first actual send.
 */
export function getResendClient(): Resend {
  if (!cachedClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable.");
    }
    cachedClient = new Resend(apiKey);
  }
  return cachedClient;
}

export function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || "ACCESS Concierge <onboarding@resend.dev>";
}

export function getAdminNotificationEmail(): string {
  const email = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!email) {
    throw new Error("Missing ADMIN_NOTIFICATION_EMAIL environment variable.");
  }
  return email;
}
