"use client";

import {
  forwardRef,
  useEffect,
  useRef,
} from "react";
import "./VariableProximity.css";

function useAnimationFrame(callback: () => void) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    let id: number;
    const loop = () => {
      cbRef.current();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
}

function useMousePositionRef(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const positionRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      } else {
        positionRef.current = { x: clientX, y: clientY };
      }
    };
    const handleMouseMove = (ev: MouseEvent) =>
      updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    const handleTouchStart = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [containerRef]);
  return positionRef;
}

const WEIGHTS = [300, 400, 700] as const;

function nearestStaticWeight(t: number): number {
  const target = 300 + t * 400;
  let best: number = WEIGHTS[0];
  let bestDist = Infinity;
  for (const w of WEIGHTS) {
    const d = Math.abs(w - target);
    if (d < bestDist) {
      bestDist = d;
      best = w;
    }
  }
  return best;
}

export type VariableProximityProps = {
  label: string;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  /** Extra scale at cursor (e.g. 0.12 → up to 12% larger). */
  maxScale?: number;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(
  (props, ref) => {
    const {
      label,
      containerRef,
      radius = 80,
      falloff = "linear",
      maxScale = 0.12,
      className = "",
      onClick,
      style,
      ...restProps
    } = props;

    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mousePositionRef = useMousePositionRef(containerRef);
    const lastPositionRef = useRef<{ x: number | null; y: number | null }>({
      x: null,
      y: null,
    });
    const reduceMotionRef = useRef(false);

    useEffect(() => {
      reduceMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }, []);

    const calculateDistance = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => Math.hypot(x2 - x1, y2 - y1);

    const calculateFalloff = (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case "exponential":
          return norm ** 2;
        case "gaussian":
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case "linear":
        default:
          return norm;
      }
    };

    useAnimationFrame(() => {
      if (!containerRef?.current || reduceMotionRef.current) {
        letterRefs.current.forEach((el) => {
          if (!el) return;
          el.style.transform = "";
          el.style.fontWeight = "";
          el.style.opacity = "1";
        });
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const { x, y } = mousePositionRef.current;
      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
        return;
      }
      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letterRef) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX =
          rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY =
          rect.top + rect.height / 2 - containerRect.top;

        const distance = calculateDistance(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          letterCenterX,
          letterCenterY,
        );

        if (distance >= radius) {
          letterRef.style.transform = "";
          letterRef.style.fontWeight = "";
          letterRef.style.opacity = "1";
          return;
        }

        const f = calculateFalloff(distance);
        const scale = 1 + maxScale * f;
        letterRef.style.transform = `scale(${scale})`;
        letterRef.style.fontWeight = String(nearestStaticWeight(f));
        letterRef.style.opacity = String(0.9 + 0.1 * f);
      });
    });

    const words = label.split(" ");
    let letterIndex = 0;

    return (
      <span
        ref={ref}
        className={`${className} variable-proximity`.trim()}
        onClick={onClick}
        style={{ display: "inline", ...style }}
        {...restProps}
      >
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex++;
              return (
                <span
                  key={currentLetterIndex}
                  ref={(el) => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  className="variable-proximity__letter"
                  aria-hidden="true"
                >
                  {letter}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span style={{ display: "inline-block" }}>&nbsp;</span>
            )}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;
