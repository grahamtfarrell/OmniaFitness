"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Proximate from "@/components/variable-proximity/Proximate";

const STORAGE_KEY = "omnia_welcome_gym_done";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function WelcomeModal() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(false);
      return;
    }
    try {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(STORAGE_KEY) === "1"
      ) {
        return;
      }
    } catch {
      /* ignore */
    }
    setVisible(true);
  }, [pathname]);

  const persistDone = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  const close = useCallback(() => {
    if (successTimer.current) {
      clearTimeout(successTimer.current);
      successTimer.current = null;
    }
    persistDone();
  }, [persistDone]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [visible, close]);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setSubmitError("");

    try {
      const res = await fetch("/api/welcome-gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const payload = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !payload.ok) {
        setSubmitStatus("error");
        setSubmitError(
          payload.error ?? "Something went wrong. Please try again.",
        );
        return;
      }
      setSubmitStatus("success");
      successTimer.current = setTimeout(() => {
        successTimer.current = null;
        persistDone();
      }, 2000);
    } catch {
      setSubmitStatus("error");
      setSubmitError("Network error. Check your connection and try again.");
    }
  };

  if (!visible) return null;

  const fieldClass =
    "w-full rounded-lg border border-black px-4 py-3 font-mono text-sm text-black placeholder:text-pink-primary focus:border-pink-primary focus:outline-none disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-start justify-center overflow-y-auto overscroll-y-contain md:items-center"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={close}
        role="presentation"
      />

      <div className="relative my-4 flex w-full max-w-lg min-h-0 max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-none md:my-8 md:max-w-xl">
        <div className="relative aspect-[5/4] w-full shrink-0 md:aspect-[16/10]">
          <img
            src="/welcome-popup-training.png"
            alt="Omnia members training during class"
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1200}
            height={800}
            fetchPriority="high"
            decoding="async"
          />
          <button
            type="button"
            onClick={close}
            className="absolute right-3 z-10 font-mono text-lg font-light leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-opacity hover:opacity-75 md:right-4 md:text-xl"
            style={{ top: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
            aria-label="Close"
          >
            <Proximate>✕</Proximate>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 md:p-10">
          <h2 className="mb-2 font-mono text-2xl font-normal leading-tight text-black md:mb-3 md:text-4xl md:leading-tight">
            <Proximate>Looking for a new gym?</Proximate>
          </h2>
          <p className="mb-6 font-mono text-sm text-black/80 md:mb-8 md:text-base">
            <Proximate>
              Drop your info below and we will get back to you.
            </Proximate>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <input
            type="text"
            name="name"
            placeholder="your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={fieldClass}
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={fieldClass}
          />
          <input
            type="tel"
            name="phone"
            placeholder="phone (+1…)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={fieldClass}
          />

          {submitStatus === "success" ? (
            <p className="pt-2 text-center font-mono text-sm text-black md:text-base">
              <Proximate>You are on the list. Talk soon.</Proximate>
            </p>
          ) : null}

          {submitStatus === "error" && submitError ? (
            <p className="text-center font-mono text-sm text-red-600" role="alert">
              <Proximate>{submitError}</Proximate>
            </p>
          ) : null}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className="rounded-lg border border-black bg-pink-primary px-8 py-3 font-mono text-sm uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent disabled:pointer-events-none disabled:opacity-50 md:text-base"
            >
              <Proximate>
                {submitStatus === "loading"
                  ? "Sending…"
                  : submitStatus === "success"
                    ? "Sent"
                    : "Submit"}
              </Proximate>
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
