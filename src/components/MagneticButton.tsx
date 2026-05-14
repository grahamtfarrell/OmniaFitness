"use client";

import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Pull strength toward cursor (0–1). */
  pull?: number;
};

export default function MagneticButton({
  children,
  className = "",
  pull = 0.22,
  onMouseMove,
  onMouseLeave,
  disabled,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  const handleMove: ButtonHTMLAttributes<HTMLButtonElement>["onMouseMove"] = (e) => {
    onMouseMove?.(e);
    if (reduced || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * pull;
    const dy = (e.clientY - cy) * pull;
    ref.current.style.setProperty("--mag-x", `${dx}px`);
    ref.current.style.setProperty("--mag-y", `${dy}px`);
  };

  const handleLeave: ButtonHTMLAttributes<HTMLButtonElement>["onMouseLeave"] = (e) => {
    onMouseLeave?.(e);
    if (!ref.current) return;
    ref.current.style.setProperty("--mag-x", "0px");
    ref.current.style.setProperty("--mag-y", "0px");
  };

  return (
    <button
      ref={ref}
      {...rest}
      disabled={disabled}
      type="button"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={[
        className,
        "[--mag-x:0px] [--mag-y:0px] will-change-transform",
        reduced ? "" : "transition-transform duration-150 ease-out",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        reduced
          ? rest.style
          : { ...rest.style, transform: "translate3d(var(--mag-x), var(--mag-y), 0)" }
      }
    >
      {children}
    </button>
  );
}
