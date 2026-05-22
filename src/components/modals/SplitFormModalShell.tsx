"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";

type SplitFormModalShellProps = {
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
  zIndex?: number;
  /** Tighter layout for forms with many fields (e.g. Book Intro). */
  compact?: boolean;
  children: ReactNode;
};

export default function SplitFormModalShell({
  imageSrc,
  imageAlt,
  onClose,
  zIndex = 10000,
  compact = false,
  children,
}: SplitFormModalShellProps) {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [lenis]);

  const modal = (
    <div
      className="fixed inset-0 flex items-start justify-center overflow-y-auto overscroll-y-contain md:items-center"
      style={{
        zIndex,
        paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
      data-lenis-prevent
      data-lenis-prevent-touch
    >
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default bg-black/70"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        className={`relative z-10 my-4 flex w-full min-h-0 max-w-4xl flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-none md:my-6 md:flex-row ${
          compact
            ? "md:max-h-[min(94dvh,700px)]"
            : "md:max-h-[min(90dvh,640px)]"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Left: photo */}
        <div
          className={`relative aspect-[5/4] w-full shrink-0 md:aspect-auto md:w-[42%] ${
            compact ? "md:min-h-0 md:self-stretch" : "md:min-h-[520px]"
          }`}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1200}
            height={800}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Right: form */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full border border-black bg-white font-mono text-xl font-light leading-none text-black transition-opacity hover:opacity-70 md:right-4 md:top-4"
            style={{ top: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
            aria-label="Close"
          >
            ✕
          </button>

          <div
            className={
              compact
                ? "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-4 pt-11 md:px-7 md:pb-5 md:pt-11"
                : "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-14 md:px-10 md:pb-10 md:pt-12"
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return modal;

  return createPortal(modal, document.body);
}

export const modalFieldClass =
  "w-full rounded-lg border border-black px-4 py-3 font-mono text-sm text-black placeholder:text-pink-primary focus:border-pink-primary focus:outline-none disabled:opacity-50";

export const modalSubmitClass =
  "w-full rounded-lg border border-black bg-pink-primary px-6 py-3.5 font-mono text-sm font-normal tracking-wide text-black transition-colors duration-300 hover:bg-transparent disabled:pointer-events-none disabled:opacity-50 md:text-base";

export const modalFieldClassCompact =
  "w-full rounded-lg border border-black px-3 py-2 font-mono text-xs text-black placeholder:text-pink-primary focus:border-pink-primary focus:outline-none disabled:opacity-50";

export const modalSubmitClassCompact =
  "w-full rounded-lg border border-black bg-pink-primary px-4 py-2.5 font-mono text-xs font-normal tracking-wide text-black transition-colors duration-300 hover:bg-transparent disabled:pointer-events-none disabled:opacity-50";
