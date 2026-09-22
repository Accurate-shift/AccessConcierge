"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import ConfirmationModal from "@/components/ConfirmationModal";

const CATEGORIES = ["Clothes", "Electronics", "Luxury Goods", "Other"];
const CONDITIONS = ["New", "Pre-owned", "Any"];
const FLEXIBILITY = ["Exact match", "Similar items accepted"];
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type FieldErrors = Partial<
  Record<"client_email" | "client_phone" | "description" | "reference_image", string>
>;

export default function RequestForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [needByDate, setNeedByDate] = useState("");
  const [flexibility, setFlexibility] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  function validateImage(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Use a PNG, JPEG, WebP, or GIF file.";
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return "Image must be 10MB or smaller.";
    }
    return null;
  }

  function handleFile(file: File) {
    const error = validateImage(file);
    if (error) {
      setErrors((prev) => ({ ...prev, reference_image: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, reference_image: undefined }));
    setImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function clearImage() {
    setImage(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {
      client_email:
        !clientEmail.trim() || !EMAIL_RE.test(clientEmail.trim())
          ? "Enter a valid email address."
          : undefined,
      client_phone: !clientPhone.trim() ? "Enter a phone or WhatsApp number." : undefined,
      description: !description.trim() ? "Tell us what you're looking for." : undefined,
    };
    setErrors((prev) => ({ ...nextErrors, reference_image: prev.reference_image }));
    return !nextErrors.client_email && !nextErrors.client_phone && !nextErrors.description;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("client_email", clientEmail.trim());
      formData.set("client_phone", clientPhone.trim());
      formData.set("description", description.trim());
      if (budget) formData.set("budget", budget);
      if (size) formData.set("size", size);
      if (category) formData.set("category", category);
      if (condition) formData.set("condition", condition);
      if (needByDate) formData.set("need_by_date", needByDate);
      if (flexibility) formData.set("flexibility", flexibility);
      if (extraNotes) formData.set("extra_notes", extraNotes);
      if (image) formData.set("reference_image", image);

      const response = await fetch("/api/requests/submit", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload.fields) {
          setErrors((prev) => ({ ...prev, ...payload.fields }));
        }
        setSubmitError(payload.error || "Something went wrong. Please try again.");
        return;
      }

      setTicketNumber(payload.ticket_number);
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForBrandNewRequest() {
    setDescription("");
    setClientEmail("");
    setClientPhone("");
    setBudget("");
    setSize("");
    setCategory("");
    setCondition("");
    setNeedByDate("");
    setFlexibility("");
    setExtraNotes("");
    clearImage();
    setErrors({});
    setTicketNumber(null);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-access-border bg-access-surface p-6 sm:p-8"
      >
        <fieldset>
          <legend className="text-sm font-medium text-white">Your contact</legend>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Email address"
              error={errors.client_email}
              htmlFor="client_email"
            >
              <input
                id="client_email"
                type="email"
                autoComplete="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass(!!errors.client_email)}
              />
            </Field>
            <Field
              label="Phone / WhatsApp"
              error={errors.client_phone}
              htmlFor="client_phone"
            >
              <input
                id="client_phone"
                type="tel"
                autoComplete="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className={inputClass(!!errors.client_phone)}
              />
            </Field>
          </div>
        </fieldset>

        <div className="my-7 h-px bg-access-border" />

        <fieldset>
          <legend className="text-sm font-medium text-white">What you need</legend>
          <div className="mt-4 space-y-5">
            <Field
              label="Description"
              error={errors.description}
              htmlFor="description"
            >
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Nike Air Force 1s, white, men's UK 9 — open to similar colourways"
                className={inputClass(!!errors.description)}
              />
            </Field>

            <div>
              <span className="text-sm text-zinc-400">Reference image (optional)</span>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
                  isDraggingOver
                    ? "border-access-accent bg-access-accent/5"
                    : "border-access-border hover:border-zinc-500"
                }`}
              >
                {imagePreviewUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewUrl}
                      alt="Reference preview"
                      className="max-h-40 rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-access-black p-1 text-zinc-400 hover:text-white"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImagePlus size={22} className="text-zinc-500" />
                    <p className="mt-2 text-sm text-zinc-400">
                      Drag an image here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">PNG, JPEG, WebP, or GIF · up to 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              {errors.reference_image && (
                <p className="mt-1.5 text-xs text-red-400">{errors.reference_image}</p>
              )}
            </div>
          </div>
        </fieldset>

        <div className="my-7 h-px bg-access-border" />

        <fieldset>
          <legend className="text-sm font-medium text-white">Details</legend>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Budget" htmlFor="budget">
              <input
                id="budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="KSh 15,000"
                className={inputClass(false)}
              />
            </Field>
            <Field label="Size" htmlFor="size">
              <input
                id="size"
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="42 / M"
                className={inputClass(false)}
              />
            </Field>
            <Field label="Category" htmlFor="category">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Condition" htmlFor="condition">
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Need by" htmlFor="need_by_date">
              <input
                id="need_by_date"
                type="date"
                value={needByDate}
                onChange={(e) => setNeedByDate(e.target.value)}
                className={inputClass(false)}
              />
            </Field>
            <Field label="Flexibility" htmlFor="flexibility">
              <select
                id="flexibility"
                value={flexibility}
                onChange={(e) => setFlexibility(e.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select flexibility</option>
                {FLEXIBILITY.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Extra notes" htmlFor="extra_notes">
              <textarea
                id="extra_notes"
                rows={3}
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Anything else we should know"
                className={inputClass(false)}
              />
            </Field>
          </div>
        </fieldset>

        {submitError && (
          <p className="mt-6 text-sm text-red-400">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-access-accent px-5 py-3 text-sm font-semibold text-access-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Submitting request" : "Submit request"}
        </button>
      </form>

      {ticketNumber && (
        <ConfirmationModal
          ticketNumber={ticketNumber}
          onClose={resetForBrandNewRequest}
        />
      )}
    </>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-lg border bg-access-black px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-access-accent ${
    hasError ? "border-red-500/60" : "border-access-border"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </label>
  );
}
