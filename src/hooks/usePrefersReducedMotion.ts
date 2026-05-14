"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Client-only read of prefers-reduced-motion. Always false on the server and on the
 * first client render so it matches SSR output and avoids hydration mismatches.
 */
export function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return matches;
}
