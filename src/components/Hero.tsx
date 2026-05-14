"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import BookingButton from "./BookingButton";
import FadeIn from "./FadeIn";
import MaskIn from "./MaskIn";
import Proximate from "@/components/variable-proximity/Proximate";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const applyParallax = useCallback(
    (scrollY: number) => {
      if (reduced || !bgRef.current || typeof window === "undefined") return;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, scrollY / vh));
      const y = p * 52;
      bgRef.current.style.transform = `translate3d(0, ${y}px, 0) scale(1.06)`;
    },
    [reduced]
  );

  useEffect(() => {
    if (reduced && bgRef.current) {
      bgRef.current.style.transform = "translate3d(0,0,0) scale(1.06)";
    }
  }, [reduced]);

  useLenis(
    (lenis) => {
      applyParallax(lenis.scroll);
    },
    [applyParallax]
  );

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      applyParallax(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, applyParallax]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform [transform:translate3d(0,0,0)_scale(1.06)]"
      >
        <Image
          src="/header.jpg"
          alt="Omnia Fitness"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <div className="hero-atmosphere-gradient absolute inset-0" />
        <div className="hero-grain absolute inset-0 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col text-left">
        <div className="min-h-0 flex-1" aria-hidden />
        <div className="flex min-h-0 flex-1 flex-col justify-start px-[calc(2rem*0.4)] pb-28 pt-[15vh] md:px-[calc(4rem*0.4)] md:pb-32 lg:px-[calc(6rem*0.4)] xl:px-[calc(8rem*0.4)]">
          <MaskIn className="mb-3 md:mb-4">
            <h1 className="whitespace-nowrap font-mono text-[clamp(calc(1.125rem*0.8),calc((100vw-3.2rem)/14*0.8),calc(3.75rem*1.35*0.8))] leading-tight tracking-tight text-white">
              <Proximate>Show up. Be real. Get strong.</Proximate>
            </h1>
          </MaskIn>

          <FadeIn>
            <BookingButton>
              <Proximate>Book Intro</Proximate>
            </BookingButton>
          </FadeIn>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 px-[calc(2rem*0.4)] pb-10 md:px-[calc(4rem*0.4)] md:pb-14 lg:px-[calc(6rem*0.4)] xl:px-[calc(8rem*0.4)]">
          <FadeIn delay={150}>
            <div className="pointer-events-auto max-w-full w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <p className="whitespace-nowrap text-left font-mono text-xs font-normal leading-none tracking-wide text-white/95 [paint-order:stroke_fill] [-webkit-text-stroke:0.55px_#fff] md:text-sm">
                <Proximate>
                  [CrossFit, Functional Fitness, Hyrox, Personal Training, Performance Driven Results]
                </Proximate>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
