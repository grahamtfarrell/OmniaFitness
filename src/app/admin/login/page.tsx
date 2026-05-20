"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Proximate from "@/components/variable-proximity/Proximate";
import { adminBtnPrimary, adminFieldClass } from "@/components/admin/AdminShell";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Invalid password");
        return;
      }
      window.location.href = from.startsWith("/admin") ? from : "/admin";
    } catch {
      setError("Login failed. Restart the dev server after changing .env.local.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-10 rounded-card border border-black bg-pink-primary/20 p-8 md:p-10">
        <h1 className="font-mono text-2xl tracking-tight text-black md:text-3xl">
          <Proximate>Blog admin</Proximate>
        </h1>
        <p className="mt-3 font-mono text-sm leading-relaxed text-black/70">
          Sign in to write and publish posts for Omnia.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-black/70">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={adminFieldClass}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-black bg-pink-primary/40 px-4 py-3 font-mono text-sm text-black"
          >
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`${adminBtnPrimary} w-full text-center`}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-10 text-center font-mono text-xs uppercase tracking-widest text-black/50">
        <Link href="/" className="underline decoration-black/30 hover:opacity-70">
          ← Back to Omnia
        </Link>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <p className="font-mono text-sm text-black/60">Loading…</p>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
