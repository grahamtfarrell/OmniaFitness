"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useBooking } from "@/context/BookingContext";
import Proximate from "@/components/variable-proximity/Proximate";

type SubmitStatus = "idle" | "loading" | "success" | "error";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  favoriteAnimal: string;
};

const emptyForm = (): FormFields => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  favoriteAnimal: "",
});

export default function BookingModal() {
  const { isOpen, flow, closeModal: closeBookingModal } = useBooking();

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
  }, [isOpen, flow]);

  useEffect(() => {
    return () => {
      if (successCloseTimer.current) clearTimeout(successCloseTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setSubmitError("");

    const isCoach = flow === "talk-coach";
    const url = isCoach ? "/api/talk-coach" : "/api/book-intro";
    const body = isCoach
      ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          favoriteAnimal: formData.favoriteAnimal,
        }
      : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        };

    try {
      const res = await fetch(url, {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  const isCoach = flow === "talk-coach";
  const title = isCoach ? "Talk to a Coach" : "Fill out the form to get started";
  const successBlurb = isCoach
    ? "Thanks — a coach will reach out soon."
    : "Thanks — you're on the list. We'll be in touch soon.";
  const idleBlurb = isCoach
    ? "Tell us a bit about you — we read every submission."
    : "We can't wait to meet you!";

  const inputClass =
    "w-full px-4 py-3 text-sm border border-black rounded-lg font-mono text-pink-primary placeholder:text-pink-primary focus:outline-none focus:border-pink-primary disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeModal}
        role="presentation"
      />

      <div className="relative bg-white rounded-xl border border-black w-full max-w-md mx-4 p-6 md:p-8">
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-black text-base font-light hover:opacity-60 transition-opacity"
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
              className={inputClass}
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
              className={inputClass}
            />
          </div>

          {!isCoach ? (
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={inputClass}
            />
          ) : null}

          <input
            type="tel"
            name="phone"
            placeholder="phone number (+1…)"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={inputClass}
          />

          {isCoach ? (
            <input
              type="text"
              name="favoriteAnimal"
              placeholder="What's your favorite animal?"
              value={formData.favoriteAnimal}
              onChange={handleChange}
              required
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={inputClass}
            />
          ) : null}

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
              className="border border-black rounded-lg px-6 py-3 font-mono text-black text-sm tracking-wide hover:bg-pink-primary hover:border-pink-primary transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
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
