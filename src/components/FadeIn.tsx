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

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    if (isElementInViewport(el)) {
      const id = window.setTimeout(() => setIsVisible(true), delay);
      return () => window.clearTimeout(id);
    }
  }, [delay, prefersReducedMotion]);

  useEffect(() => {
    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const ms = prefersReducedMotion ? 0 : delay;
          timeoutId = window.setTimeout(() => setIsVisible(true), ms);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delay, prefersReducedMotion]);

  const durationClass = prefersReducedMotion ? "duration-0" : "duration-300";

  return (
    <div
      ref={ref}
      className={`transition-opacity ease-out ${durationClass} ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
