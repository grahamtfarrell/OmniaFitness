"use client";

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  type AriaRole,
  type ReactElement,
  type ReactNode,
} from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { isElementInViewport } from "@/lib/isElementInViewport";

type StaggerListProps = {
  as?: keyof JSX.IntrinsicElements;
  role?: AriaRole;
  children: ReactNode;
  className?: string;
  /** Delay between consecutive items (ms). */
  staggerMs?: number;
  /** Single-item motion duration (ms). */
  durationMs?: number;
};

export default function StaggerList({
  as = "div",
  role,
  className = "",
  children,
  staggerMs = 48,
  durationMs = 380,
}: StaggerListProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setVisible(true);
      return;
    }
    if (isElementInViewport(el)) {
      setVisible(true);
    }
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "80px 0px 120px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const transition = reduced
    ? "none"
    : `opacity ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  const mapped = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    const delay = reduced ? 0 : visible ? index * staggerMs : 0;
    const el = child as ReactElement<{ className?: string; style?: React.CSSProperties }>;
    return cloneElement(el, {
      className: [el.props.className, "will-change-transform"].filter(Boolean).join(" "),
      style: {
        ...el.props.style,
        opacity: reduced || visible ? 1 : 0,
        transform: reduced || visible ? "translate3d(0,0,0)" : "translate3d(0,12px,0)",
        transition,
        transitionDelay: `${delay}ms`,
      },
    });
  });

  return createElement(as, { ref, className, ...(role !== undefined ? { role } : {}) }, mapped);
}
