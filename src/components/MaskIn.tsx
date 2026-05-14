"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { isElementInViewport } from "@/lib/isElementInViewport";

type MaskInProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay before reveal starts (ms). */
  delay?: number;
};

export default function MaskIn({ children, className = "", delay = 0 }: MaskInProps) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setOn(true);
      return;
    }
    if (isElementInViewport(el)) {
      const id = window.setTimeout(() => setOn(true), delay);
      return () => window.clearTimeout(id);
    }
  }, [reduced, delay]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const ms = reduced ? 0 : delay;
          timeoutId = window.setTimeout(() => setOn(true), ms);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delay, reduced]);

  const active = reduced || on;
  const duration = reduced ? 0 : 650;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className={
          active
            ? "translate-y-0 opacity-100 [clip-path:inset(0_0_0_0)]"
            : "translate-y-3 opacity-0 [clip-path:inset(100%_0_0_0)]"
        }
        style={{
          transitionProperty: reduced ? "none" : "opacity, transform, clip-path",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
