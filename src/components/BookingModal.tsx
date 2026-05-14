"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useBooking } from "@/context/BookingContext";
import Proximate from "@/components/variable-proximity/Proximate";
import { CONTACT_INTEREST_OPTIONS } from "@/lib/contact-interest-options";

type SubmitStatus = "idle" | "loading" | "success" | "error";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  lifeNotes: string;
};

const emptyForm = (): FormFields => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  interest: "",
  lifeNotes: "",
});

export default function BookingModal() {
  const { isOpen, closeModal: closeBookingModal } = useBooking();

  const closeModal = useCallback(() => {
    if (successCloseTimer.current) {
      clearTimeout(successCloseTimer.current);
      successCloseTimer.current = null;
    }
    closeBookingModal();
  }, [closeBookingModal]);
  const [formData, setFormData] = useState<FormFields>(emptyForm);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const successCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (isOpen) {
      setSubmitStatus("idle");
      setSubmitError("");
      setFormData(emptyForm());
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (successCloseTimer.current) clearTimeout(successCloseTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setSubmitError("");

    const body = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      interest: formData.interest,
      notes: formData.lifeNotes,
    };

    try {
      const res = await fetch("/api/book-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !payload.ok) {
        setSubmitStatus("error");
        setSubmitError(
          payload.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setSubmitStatus("success");
      setFormData(emptyForm());
      if (successCloseTimer.current) clearTimeout(successCloseTimer.current);
      successCloseTimer.current = setTimeout(() => {
        successCloseTimer.current = null;
        closeModal();
      }, 2200);
    } catch {
      setSubmitStatus("error");
      setSubmitError("Network error. Check your connection and try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  const title = "Fill out the form to get started";
  const successBlurb = "Thanks — you're on the list. We'll be in touch soon.";
  const idleBlurb = "We can't wait to meet you!";

  const fieldClass =
    "w-full px-4 py-3 text-sm border border-black rounded-lg font-mono text-pink-primary placeholder:text-pink-primary focus:outline-none focus:border-pink-primary disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto overscroll-y-contain md:items-center"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeModal}
        role="presentation"
      />

      <div className="relative my-4 w-full max-w-md min-h-0 max-h-[min(calc(100dvh-2rem),720px)] overflow-y-auto overscroll-contain rounded-xl border border-black bg-white p-6 md:my-8 md:p-8">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 text-base font-light text-black transition-opacity hover:opacity-60"
          style={{ top: "max(1rem, env(safe-area-inset-top, 0px))" }}
        >
          <Proximate>✕</Proximate>
        </button>

        <h2 className="text-xl md:text-2xl font-mono font-normal text-black mb-6 pr-6">
          <Proximate>{title}</Proximate>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={fieldClass}
            />
            <input
              type="text"
              name="lastName"
              placeholder="last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={fieldClass}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={fieldClass}
          />

          <input
            type="tel"
            name="phone"
            placeholder="phone number (+1…)"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={fieldClass}
          />

          <div>
            <label
              htmlFor="interest"
              className="mb-1 block font-mono text-xs text-black"
            >
              <Proximate>What brings you here?</Proximate>
            </label>
            <select
              id="interest"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              required
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={`${fieldClass} bg-white text-black`}
            >
              <option value="" disabled>
                Select one…
              </option>
              {CONTACT_INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="lifeNotes"
              className="mb-1 block font-mono text-xs text-black leading-snug"
            >
              <Proximate>
                Tell us about your life. Whats your life like and who are you?
              </Proximate>
            </label>
            <textarea
              id="lifeNotes"
              name="lifeNotes"
              rows={4}
              placeholder="notes (optional)"
              value={formData.lifeNotes}
              onChange={handleChange}
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={`${fieldClass} resize-y min-h-[100px] text-black placeholder:text-pink-primary/70`}
            />
          </div>

          {submitStatus === "success" ? (
            <p className="text-center font-mono text-black text-sm pt-3">
              <Proximate>{successBlurb}</Proximate>
            </p>
          ) : (
            <p className="text-center font-mono text-black text-sm pt-3">
              <Proximate>{idleBlurb}</Proximate>
            </p>
          )}

          {submitStatus === "error" && submitError ? (
            <p
              className="text-center font-mono text-sm text-red-600 pt-1"
              role="alert"
            >
              <Proximate>{submitError}</Proximate>
            </p>
          ) : null}

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className="rounded-lg border border-black bg-pink-primary px-6 py-3 font-mono text-black text-sm tracking-wide transition-colors duration-300 hover:bg-transparent disabled:opacity-50 disabled:pointer-events-none"
            >
              <Proximate>
                {submitStatus === "loading"
                  ? "Submitting…"
                  : submitStatus === "success"
                    ? "Sent"
                    : "Submit"}
              </Proximate>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
