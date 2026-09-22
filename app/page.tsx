import { Fraunces, Inter } from "next/font/google";
import RequestForm from "@/components/RequestForm";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const steps = [
  {
    title: "Describe what you need",
    body: "Item, size, budget, and how flexible you are on substitutes.",
  },
  {
    title: "We search and quote",
    body: "Usually within a day, by email or WhatsApp.",
  },
  {
    title: "Approve and receive",
    body: "We fulfill the order and keep you updated through delivery.",
  },
];

export default function Home() {
  return (
    <main
      className={`${fraunces.variable} ${inter.variable} min-h-screen font-sans`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-20">
        {/* Left: brand + hero + how it works */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <span className="text-xs font-semibold tracking-[0.2em] text-access-accent">
            ACCESS CONCIERGE
          </span>

          <h1
            className="mt-5 text-4xl font-serif font-medium leading-[1.15] text-white sm:text-5xl"
          >
            Tell us what you&rsquo;re after. We&rsquo;ll go find it.
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400">
            ACCESS sources hard-to-find items — clothing, electronics, luxury
            goods — and handles the errand end to end. Submit a request and
            we&rsquo;ll follow up with a quote.
          </p>

          <ol className="mt-10 hidden divide-y divide-access-border border-t border-access-border lg:block">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-5">
                <span className="font-serif text-lg text-zinc-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: the form */}
        <RequestForm />
      </div>
    </main>
  );
}
