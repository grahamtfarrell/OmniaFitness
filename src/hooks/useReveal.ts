"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { isElementInViewport } from "@/lib/isElementInViewport";

type UseRevealOptions = {
  delay?: number;
  /** IntersectionObserver root margin */
  rootMargin?: string;
  /** Force visible if reveal never triggers (Lenis / dev Strict Mode). */
  fallbackMs?: number;
};

/**
 * Reveals content when it enters the viewport. Synchronous when already visible;
 * includes scroll/resize/Lenis listeners and a timeout fallback so copy does not
 * stay stuck at opacity 0 in development.
 */
export function useReveal({
  delay = 0,
  rootMargin = "100px 0px 100px 0px",
  fallbackMs = 750,
}: UseRevealOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  const reveal = () => {
    if (!revealedRef.current) setRevealed(true);
  };

  const tryRevealIfInView = () => {
    const el = ref.current;
    if (!el || revealedRef.current || reduced) return;
    if (!isElementInViewport(el)) return;
    if (delay === 0) reveal();
    else window.setTimeout(reveal, delay);
  };

  useLayoutEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el || !isElementInViewport(el)) return;
    if (delay === 0) {
      reveal();
      return;
    }
    const id = window.setTimeout(reveal, delay);
    return () => window.clearTimeout(id);
  }, [delay, reduced]);

  useEffect(() => {
    if (reduced || revealedRef.current) return;

    const el = ref.current;
    if (!el) return;

    let delayTimeoutId: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay === 0) reveal();
          else delayTimeoutId = window.setTimeout(reveal, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin },
    );

    observer.observe(el);

    const fallbackId = window.setTimeout(reveal, fallbackMs);
    const onScroll = () => tryRevealIfInView();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackId);
      if (delayTimeoutId !== undefined) window.clearTimeout(delayTimeoutId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [delay, reduced, rootMargin, fallbackMs]);

  return { ref, revealed: reduced || revealed };
}
