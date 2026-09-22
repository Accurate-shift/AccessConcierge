"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setIsSubmitting(false);
      return;
    }

    const redirectedFrom = searchParams.get("redirectedFrom");
    router.replace(redirectedFrom || "/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-access-black px-6">
      <div className="w-full max-w-sm rounded-2xl border border-access-border bg-access-surface p-8">
        <span className="text-xs font-semibold tracking-[0.2em] text-access-accent">
          ACCESS CONCIERGE
        </span>
        <h1 className="mt-4 text-xl font-semibold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          For the ACCESS team only.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-zinc-400">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-access-border bg-access-black px-3.5 py-2.5 text-sm text-white outline-none focus:border-access-accent"
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-access-border bg-access-black px-3.5 py-2.5 text-sm text-white outline-none focus:border-access-accent"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-access-accent px-5 py-2.5 text-sm font-semibold text-access-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Signing in" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
