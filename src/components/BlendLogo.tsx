"use client";

import { NEWSLETTER_LAYOUT, useNewsletterBanner } from "@/context/NewsletterBannerContext";

export default function BlendLogo() {
  const { bannerVisible } = useNewsletterBanner();
  const topPx = bannerVisible
    ? NEWSLETTER_LAYOUT.logoTop.withBanner
    : NEWSLETTER_LAYOUT.logoTop.withoutBanner;

  return (
    <div
      style={{
        position: "fixed",
        top: `${topPx}px`,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        mixBlendMode: "difference",
        transition: "top 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <img
        src="/omnia-logo.png"
        alt="Omnia"
        style={{
          height: "72px",
          width: "auto",
        }}
      />
    </div>
  );
}
