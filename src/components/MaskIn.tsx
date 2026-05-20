"use client";

import type { ReactNode, RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useReveal } from "@/hooks/useReveal";

type MaskInProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay before reveal starts (ms). */
  delay?: number;
};

export default function MaskIn({ children, className = "", delay = 0 }: MaskInProps) {
  const { ref, revealed } = useReveal({ delay });
  const reduced = usePrefersReducedMotion();
  const active = revealed;
  const duration = reduced ? 0 : 650;

  return (
    <div ref={ref as RefObject<HTMLDivElement>} className={`overflow-hidden ${className}`}>
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
