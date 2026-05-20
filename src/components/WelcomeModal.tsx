"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Proximate from "@/components/variable-proximity/Proximate";
import SplitFormModalShell, {
  modalFieldClass,
  modalSubmitClass,
} from "@/components/modals/SplitFormModalShell";
import FormConsentCheckbox from "@/components/modals/FormConsentCheckbox";
import { useWelcomeModal } from "@/context/WelcomeModalContext";

const STORAGE_KEY = "omnia_welcome_gym_done";
const MODAL_IMAGE = "/welcome-popup-training.png";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function WelcomeModal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen: manualOpen, openWelcomeModal, closeWelcomeModal } =
    useWelcomeModal();
  const forcePreview =
    process.env.NODE_ENV === "development" &&
    searchParams.get("welcome") === "1";
  const [autoOpen, setAutoOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = manualOpen || autoOpen || forcePreview;

  const markDismissed = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const hide = useCallback(() => {
    setAutoOpen(false);
    closeWelcomeModal();
  }, [closeWelcomeModal]);

  const close = useCallback(
    (options?: { persist?: boolean }) => {
      if (successTimer.current) {
        clearTimeout(successTimer.current);
        successTimer.current = null;
      }
      if (options?.persist ?? (autoOpen || forcePreview)) {
        markDismissed();
      }
      hide();
    },
    [autoOpen, forcePreview, hide, markDismissed],
  );

  useEffect(() => {
    if (forcePreview) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setAutoOpen(true);
      return;
    }

    if (pathname !== "/") {
      setAutoOpen(false);
      return;
    }

    try {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(STORAGE_KEY) === "1"
      ) {
        setAutoOpen(false);
        return;
      }
    } catch {
      /* ignore */
    }
    setAutoOpen(true);
  }, [pathname, forcePreview]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const openFromHash = () => {
      if (window.location.hash === "#newsletter") {
        openWelcomeModal();
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openWelcomeModal]);

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
    if (!consent) return;
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
        close({ persist: true });
      }, 2000);
    } catch {
      setSubmitStatus("error");
      setSubmitError("Network error. Check your connection and try again.");
    }
  };

  if (!visible) return null;

  const disabled = submitStatus === "loading" || submitStatus === "success";

  return (
    <SplitFormModalShell
      imageSrc={MODAL_IMAGE}
      imageAlt="Omnia members training during class"
      onClose={() => close()}
      zIndex={10002}
    >
      <h2 className="mb-3 font-mono text-2xl font-normal leading-tight text-black md:text-[1.75rem]">
        <Proximate>Looking for a new gym?</Proximate>
      </h2>

      <p className="mb-3 font-mono text-sm leading-relaxed text-black md:text-[0.9375rem]">
        <Proximate>
          Get class updates, coach tips, and community news from Omnia — the
          kind of stuff we only send when it is worth your time.
        </Proximate>
      </p>
      <p className="mb-6 font-mono text-sm leading-relaxed text-black/80 md:mb-7 md:text-[0.9375rem]">
        <Proximate>
          Your inbox matters to us. We will only reach out when it is relevant,
          and you can opt out anytime.
        </Proximate>
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          disabled={disabled}
          className={modalFieldClass}
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={disabled}
          className={modalFieldClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder="phone (+1…)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
          disabled={disabled}
          className={modalFieldClass}
        />

        <FormConsentCheckbox
          id="welcome-consent"
          checked={consent}
          onChange={setConsent}
          disabled={disabled}
          includeSms
        />

        {submitStatus === "success" ? (
          <p className="text-center font-mono text-sm text-black">
            <Proximate>You are on the list. Talk soon.</Proximate>
          </p>
        ) : null}

        {submitStatus === "error" && submitError ? (
          <p className="text-center font-mono text-sm text-red-600" role="alert">
            <Proximate>{submitError}</Proximate>
          </p>
        ) : null}

        <button
          type="submit"
          disabled={disabled || !consent}
          className={modalSubmitClass}
        >
          <Proximate>
            {submitStatus === "loading"
              ? "Sending…"
              : submitStatus === "success"
                ? "Sent"
                : "Join the list"}
          </Proximate>
        </button>
      </form>

      <button
        type="button"
        onClick={() => close()}
        className="mt-5 w-full text-center font-mono text-sm font-normal text-black underline underline-offset-2 transition-opacity hover:opacity-60"
      >
        <Proximate>No, I don&apos;t want updates</Proximate>
      </button>
    </SplitFormModalShell>
  );
}
