import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { sendClientReceiptEmail, sendAdminAlertEmail } from "@/lib/email";
import type { RequestInsert } from "@/types/database";

export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB, matches the storage bucket limit
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function readString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // --- Required fields -------------------------------------------------
  const client_email = readString(formData, "client_email");
  const client_phone = readString(formData, "client_phone");
  const description = readString(formData, "description");

  const errors: Record<string, string> = {};
  if (!client_email || !EMAIL_RE.test(client_email)) {
    errors.client_email = "A valid email address is required.";
  }
  if (!client_phone) {
    errors.client_phone = "A phone / WhatsApp number is required.";
  }
  if (!description) {
    errors.description = "Please describe what you're looking for.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 400 });
  }

  // --- Optional fields ---------------------------------------------------
  const budget = readString(formData, "budget");
  const size = readString(formData, "size");
  const category = readString(formData, "category");
  const condition = readString(formData, "condition");
  const need_by_date = readString(formData, "need_by_date");
  const flexibility = readString(formData, "flexibility");
  const extra_notes = readString(formData, "extra_notes");

  const supabase = createAdminSupabaseClient();

  // --- Optional image upload ---------------------------------------------
  let reference_image_url: string | null = null;
  const imageFile = formData.get("reference_image");

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Reference image must be PNG, JPEG, WebP, or GIF." },
        { status: 400 }
      );
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Reference image must be 10MB or smaller." },
        { status: 400 }
      );
    }

    const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const objectPath = `${randomUUID()}.${extension}`;
    const bytes = await imageFile.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("request-images")
      .upload(objectPath, bytes, {
        contentType: imageFile.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload reference image. Please try again." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("request-images")
      .getPublicUrl(objectPath);
    reference_image_url = publicUrlData.publicUrl;
  }

  // --- Insert the request row ---------------------------------------------
  const insertPayload: RequestInsert = {
    client_email: client_email!,
    client_phone: client_phone!,
    description: description!,
    reference_image_url,
    budget,
    size,
    category,
    condition,
    need_by_date,
    flexibility,
    extra_notes,
  };

  const { data: insertedRequest, error: insertError } = await supabase
    .from("requests")
    .insert(insertPayload)
    .select()
    .single();

  if (insertError || !insertedRequest) {
    console.error("Request insert failed:", insertError);
    return NextResponse.json(
      { error: "Failed to save your request. Please try again." },
      { status: 500 }
    );
  }

  // --- Fire both emails in parallel. Email failure should never fail the
  // request submission itself — the row is already saved — so we log and
  // move on rather than throwing.
  const emailResults = await Promise.allSettled([
    sendClientReceiptEmail({
      to: insertedRequest.client_email,
      ticketNumber: insertedRequest.ticket_number,
      description: insertedRequest.description,
    }),
    sendAdminAlertEmail({ request: insertedRequest }),
  ]);

  emailResults.forEach((result, index) => {
    if (result.status === "rejected") {
      const label = index === 0 ? "client receipt" : "admin alert";
      console.error(`Failed to send ${label} email:`, result.reason);
    }
  });

  return NextResponse.json(
    { ticket_number: insertedRequest.ticket_number, id: insertedRequest.id },
    { status: 201 }
  );
}
