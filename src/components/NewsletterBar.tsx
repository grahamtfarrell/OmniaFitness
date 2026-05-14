"use client";

import Proximate from "@/components/variable-proximity/Proximate";
import { useNewsletterBanner } from "@/context/NewsletterBannerContext";

export default function NewsletterBar() {
  const { bannerVisible, dismissBanner } = useNewsletterBanner();

  if (!bannerVisible) {
    return (
      <div
        id="newsletter"
        className="pointer-events-none fixed top-0 left-0 h-px w-full scroll-mt-0 opacity-0"
        aria-hidden
      />
    );
  }

  return (
    <div
      id="newsletter"
      className="relative scroll-mt-0 bg-pink-primary py-1.5 pl-4 pr-10 text-center md:pr-12"
    >
      <button
        type="button"
        onClick={dismissBanner}
        aria-label="Dismiss newsletter prompt"
        className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 px-2 py-1 font-mono text-base font-light leading-none text-black transition-opacity hover:opacity-55 md:right-3"
      >
        ✕
      </button>
      <p className="text-center text-sm font-mono tracking-wide text-black md:text-base">
        <Proximate>join our newsletter</Proximate>
      </p>
    </div>
  );
}
