"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useBooking } from "@/context/BookingContext";
import Proximate from "@/components/variable-proximity/Proximate";
import { CONTACT_INTEREST_OPTIONS } from "@/lib/contact-interest-options";
import SplitFormModalShell, {
  modalFieldClassCompact,
  modalSubmitClassCompact,
} from "@/components/modals/SplitFormModalShell";
import FormConsentCheckbox from "@/components/modals/FormConsentCheckbox";

const MODAL_IMAGE = "/welcome-popup-training.png";

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
  const [consent, setConsent] = useState(false);
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
      setConsent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (successCloseTimer.current) clearTimeout(successCloseTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
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
      setConsent(false);
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

  const disabled = submitStatus === "loading" || submitStatus === "success";
  const field = modalFieldClassCompact;

  return (
    <SplitFormModalShell
      imageSrc={MODAL_IMAGE}
      imageAlt="Omnia members training during class"
      onClose={closeModal}
      zIndex={10000}
      compact
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="shrink-0">
          <h2 className="font-mono text-lg font-normal leading-tight text-black md:text-xl">
            <Proximate>Book your intro</Proximate>
          </h2>
          <p className="mt-1 font-mono text-xs leading-snug text-black/75">
            <Proximate>We&apos;ll reach out to schedule your free intro.</Proximate>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-2"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
              disabled={disabled}
              className={field}
            />
            <input
              type="text"
              name="lastName"
              placeholder="last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
              disabled={disabled}
              className={field}
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
            disabled={disabled}
            className={field}
          />

          <input
            type="tel"
            name="phone"
            placeholder="phone (+1…)"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            disabled={disabled}
            className={field}
          />

          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            required
            disabled={disabled}
            aria-label="What brings you here?"
            className={`${field} bg-white text-black`}
          >
            <option value="" disabled>
              What brings you here?
            </option>
            {CONTACT_INTEREST_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <textarea
            id="lifeNotes"
            name="lifeNotes"
            rows={2}
            placeholder="about you (optional)"
            value={formData.lifeNotes}
            onChange={handleChange}
            disabled={disabled}
            className={`${field} min-h-[3.25rem] resize-none text-black placeholder:text-pink-primary/70`}
          />

          <FormConsentCheckbox
            id="book-intro-consent"
            checked={consent}
            onChange={setConsent}
            disabled={disabled}
            includeSms
            compact
          />

          {submitStatus === "success" ? (
            <p className="text-center font-mono text-xs text-black">
              <Proximate>Thanks — we&apos;ll be in touch soon.</Proximate>
            </p>
          ) : null}

          {submitStatus === "error" && submitError ? (
            <p
              className="text-center font-mono text-xs text-red-600"
              role="alert"
            >
              <Proximate>{submitError}</Proximate>
            </p>
          ) : null}

          <button
            type="submit"
            disabled={disabled || !consent}
            className={modalSubmitClassCompact}
          >
            <Proximate>
              {submitStatus === "loading"
                ? "Submitting…"
                : submitStatus === "success"
                  ? "Sent"
                  : "Book intro"}
            </Proximate>
          </button>
        </form>
      </div>
    </SplitFormModalShell>
  );
}
