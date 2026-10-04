"use client";

import { useState } from "react";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const WHATSAPP_NUMBER = "254797060575";

const categories = [
  "Fashion",
  "Sneakers",
  "Watches",
  "Electronics",
  "Luxury",
  "Accessories",
  "Other",
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    item: "",
    category: "",
    size: "",
    budget: "",
    details: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openRequest() {
    setSent(false);
    setOpen(true);
  }

  function closeRequest() {
    setOpen(false);
  }

  function submitRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = [
      "Hi ACCESS, I'd like to make a concierge request.",
      "",
      `Name: ${form.name || "Not provided"}`,
      `Phone: ${form.phone || "Not provided"}`,
      "",
      `Looking for: ${form.item}`,
      `Category: ${form.category || "Not specified"}`,
      `Size: ${form.size || "Not specified"}`,
      `Budget: ${form.budget || "Not specified"}`,
      "",
      `Details: ${form.details || "None provided"}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");

    setSent(true);
  }

  return (
    <main
      className={`${fraunces.variable} ${inter.variable} min-h-screen`}
    >
      {/* Header */}
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[11px] font-semibold tracking-[0.12em]">
              A
            </div>

            <span className="text-xs font-semibold tracking-[0.24em] text-white">
              ACCESS
            </span>
          </div>

          <button
            type="button"
            onClick={openRequest}
            aria-label="Make an ACCESS Concierge request"
            className="group flex items-center gap-3"
          >
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500 transition group-hover:text-zinc-300 sm:block">
              Make a request
            </span>

            <span className="bell flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition duration-300 group-hover:border-white/35 group-hover:bg-white/[0.08]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 9C18 5.686 15.314 3 12 3C8.686 3 6 5.686 6 9C6 16 3.5 16 3.5 18H20.5C20.5 16 18 16 18 9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 21H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#d4af37]/[0.035] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:pt-36">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              ACCESS CONCIERGE
            </p>

            <h1 className="mt-7 max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.025em] text-white sm:text-6xl lg:text-8xl">
              You ask.
              <br />
              <span className="text-zinc-500">We source.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              ACCESS is a personal sourcing service for the things worth
              looking for. Tell us what you want, where you are flexible, and
              what you want to spend. We take it from there.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openRequest}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Ring the bell

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 9C18 5.686 15.314 3 12 3C8.686 3 6 5.686 6 9C6 16 3.5 16 3.5 18H20.5C20.5 16 18 16 18 9Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 21H14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <span className="text-xs text-zinc-600">
                Fashion · Electronics · Luxury · And more
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What ACCESS does */}
      <section className="border-y border-white/[0.08]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:px-8 md:grid-cols-3">
          <div className="border-b border-white/[0.08] py-10 md:border-b-0 md:border-r md:pr-10 md:py-14">
            <span className="font-serif text-xl text-zinc-500">01</span>

            <h2 className="mt-5 text-sm font-semibold text-white">
              Tell us what you want
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
              Give us the item, brand, size, budget, references, or simply
              describe what you have in mind.
            </p>
          </div>

          <div className="border-b border-white/[0.08] py-10 md:border-b-0 md:border-r md:px-10 md:py-14">
            <span className="font-serif text-xl text-zinc-500">02</span>

            <h2 className="mt-5 text-sm font-semibold text-white">
              We source it
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
              ACCESS searches our network and available sources to find the
              right option for your request.
            </p>
          </div>

          <div className="py-10 md:pl-10 md:py-14">
            <span className="font-serif text-xl text-zinc-500">03</span>

            <h2 className="mt-5 text-sm font-semibold text-white">
              We come back to you
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
              Once we have an option, we send you the details and take it
              forward with you.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
              THE SERVICE
            </p>

            <h2 className="mt-5 font-serif text-3xl leading-tight text-white sm:text-4xl">
              Personal sourcing,
              <br />
              without the noise.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-zinc-400">
              Some things are easy to buy. Others are worth having someone
              look for.
            </p>

            <p className="mt-6 text-lg leading-8 text-zinc-500">
              ACCESS Concierge exists for the latter. Whether it is a specific
              pair of sneakers, a particular watch, a hard-to-source
              electronic, a gift, or something you cannot quite put into a
              product search — send us the request.
            </p>

            <button
              type="button"
              onClick={openRequest}
              className="mt-9 text-sm font-semibold text-white underline decoration-white/20 underline-offset-8 transition hover:decoration-white"
            >
              Make a request →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-zinc-600">
            ACCESS CONCIERGE
          </span>

          <span className="text-xs text-zinc-600">
            Personal sourcing, on request.
          </span>
        </div>
      </footer>

      {/* Request modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeRequest();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#111112] p-6 shadow-2xl sm:rounded-[28px] sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                  ACCESS CONCIERGE
                </p>

                <h2 className="mt-3 font-serif text-3xl text-white">
                  Make a request
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Tell us what you want and we&rsquo;ll take it from there.
                </p>
              </div>

              <button
                type="button"
                onClick={closeRequest}
                aria-label="Close request form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-white/20 hover:text-white"
              >
                ×
              </button>
            </div>

            {sent ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/30 text-[#d4af37]">
                  ✓
                </div>

                <h3 className="mt-6 font-serif text-2xl text-white">
                  Request ready
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                  WhatsApp has been opened with your request addressed to
                  ACCESS.
                </p>

                <button
                  type="button"
                  onClick={closeRequest}
                  className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submitRequest} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Your name"
                    required
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                    placeholder="Name"
                  />

                  <Field
                    label="WhatsApp number"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    placeholder="+254..."
                    type="tel"
                  />
                </div>

                <Field
                  label="What are you looking for?"
                  required
                  value={form.item}
                  onChange={(value) => updateField("item", value)}
                  placeholder="e.g. Nike Air Jordan 1 Chicago"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-400">
                      Category
                    </label>

                    <select
                      value={form.category}
                      onChange={(e) =>
                        updateField("category", e.target.value)
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-white/30"
                    >
                      <option value="" className="bg-[#111112]">
                        Select category
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#111112]"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Field
                    label="Size"
                    value={form.size}
                    onChange={(value) => updateField("size", value)}
                    placeholder="e.g. EU 43 / Medium"
                  />
                </div>

                <Field
                  label="Budget"
                  value={form.budget}
                  onChange={(value) => updateField("budget", value)}
                  placeholder="e.g. KES 50,000"
                />

                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Anything else we should know?
                  </label>

                  <textarea
                    value={form.details}
                    onChange={(e) =>
                      updateField("details", e.target.value)
                    }
                    placeholder="Brand preferences, colour, reference links, alternatives you're open to, deadline, etc."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30"
                  />
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <p className="text-xs leading-5 text-zinc-500">
                    When you send, WhatsApp will open with your request
                    addressed directly to ACCESS.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Send on WhatsApp

                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 11.5C20 15.642 16.418 19 12 19C10.776 19 9.626 18.736 8.614 18.267L5 19.5L6.115 16.14C5.414 14.85 5 13.378 5 11.8C5 7.657 8.582 4 13 4C17.418 4 20 7.357 20 11.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
        {required && <span className="ml-1 text-[#d4af37]">*</span>}
      </label>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/30"
      />
    </div>
  );
}