"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useBooking } from "@/context/BookingContext";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function BookingModal() {
  const { isOpen, closeModal: closeBookingModal } = useBooking();

  const closeModal = useCallback(() => {
    if (successCloseTimer.current) {
      clearTimeout(successCloseTimer.current);
      successCloseTimer.current = null;
    }
    closeBookingModal();
  }, [closeBookingModal]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const successCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on escape key
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

    try {
      const res = await fetch("/api/book-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }),
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
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
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

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl border border-black w-full max-w-md mx-4 p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-black text-base font-light hover:opacity-60 transition-opacity"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-mono font-normal text-black mb-6 pr-6">
          Fill out the form to get started
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className="w-full px-4 py-3 text-sm border border-black rounded-lg font-mono text-pink-primary placeholder:text-pink-primary focus:outline-none focus:border-pink-primary disabled:opacity-50"
            />
            <input
              type="text"
              name="lastName"
              placeholder="last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className="w-full px-4 py-3 text-sm border border-black rounded-lg font-mono text-pink-primary placeholder:text-pink-primary focus:outline-none focus:border-pink-primary disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className="w-full px-4 py-3 text-sm border border-black rounded-lg font-mono text-pink-primary placeholder:text-pink-primary focus:outline-none focus:border-pink-primary disabled:opacity-50"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="phone number (+1…)"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className="w-full px-4 py-3 text-sm border border-black rounded-lg font-mono text-pink-primary placeholder:text-pink-primary focus:outline-none focus:border-pink-primary disabled:opacity-50"
          />

          {/* Footer Text */}
          {submitStatus === "success" ? (
            <p className="text-center font-mono text-black text-sm pt-3">
              Thanks — you&apos;re on the list. We&apos;ll be in touch soon.
            </p>
          ) : (
            <p className="text-center font-mono text-black text-sm pt-3">
              We can&apos;t wait to meet you!
            </p>
          )}

          {submitStatus === "error" && submitError ? (
            <p
              className="text-center font-mono text-sm text-red-600 pt-1"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}

          {/* Submit Button */}
          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className="border border-black rounded-lg px-6 py-3 font-mono text-black text-sm tracking-wide hover:bg-pink-primary hover:border-pink-primary transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitStatus === "loading"
                ? "Submitting…"
                : submitStatus === "success"
                  ? "Sent"
                  : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
