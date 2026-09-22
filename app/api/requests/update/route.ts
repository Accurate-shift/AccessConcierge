import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { sendClientStatusUpdateEmail } from "@/lib/email";
import type { RequestStatus } from "@/types/database";

export const runtime = "nodejs";

const VALID_STATUSES: RequestStatus[] = [
  "PENDING",
  "IN_REVIEW",
  "QUOTED",
  "FULFILLED",
  "UNAVAILABLE",
];

interface UpdateBody {
  id: string;
  status: RequestStatus;
  quoted_price?: string | null;
  admin_response_notes?: string | null;
  notify_client?: boolean;
}

export async function POST(req: NextRequest) {
  // --- Auth check: must be a logged-in Supabase Auth user (an admin). This
  // uses the cookie-bound server client, NOT the service-role client, so it
  // actually reflects who is signed in for this request.
  const authClient = createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { id, status, quoted_price, admin_response_notes, notify_client } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing request id." }, { status: 400 });
  }
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  // Use the service-role client for the actual write. RLS would already
  // allow this for an authenticated user per schema.sql, but the service
  // role keeps this route's DB access explicit and independent of policy
  // changes, since the auth check above is what actually gates the action.
  const supabase = createAdminSupabaseClient();

  const { data: updatedRequest, error: updateError } = await supabase
    .from("requests")
    .update({
      status,
      quoted_price: quoted_price ?? null,
      admin_response_notes: admin_response_notes ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !updatedRequest) {
    console.error("Request update failed:", updateError);
    return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
  }

  // --- "Send Update to Client" button controls whether an email fires.
  // Defaults to true so a plain status change (no explicit flag) still
  // notifies the client, matching the spec's "Send Update to Client" action.
  const shouldNotify = notify_client !== false;

  if (shouldNotify) {
    try {
      await sendClientStatusUpdateEmail({
        to: updatedRequest.client_email,
        ticketNumber: updatedRequest.ticket_number,
        status: updatedRequest.status,
        quotedPrice: updatedRequest.quoted_price,
        adminResponseNotes: updatedRequest.admin_response_notes,
      });
    } catch (emailError) {
      // The DB write already succeeded — don't fail the whole request over
      // a flaky email send, but surface it so the admin knows to follow up.
      console.error("Failed to send client status update email:", emailError);
      return NextResponse.json(
        {
          request: updatedRequest,
          warning: "Request updated, but the client notification email failed to send.",
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json({ request: updatedRequest }, { status: 200 });
}
