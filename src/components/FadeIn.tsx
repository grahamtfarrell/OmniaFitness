"use client";

import type { ReactNode, RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useReveal } from "@/hooks/useReveal";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const { ref, revealed } = useReveal({ delay });
  const prefersReducedMotion = usePrefersReducedMotion();
  const durationClass = prefersReducedMotion ? "duration-0" : "duration-300";

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`transition-opacity ease-out ${durationClass} ${revealed ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
