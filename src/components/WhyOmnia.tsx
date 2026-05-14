"use client";

import Image from "next/image";
import { useEffect } from "react";
import FadeIn from "./FadeIn";
import MaskIn from "./MaskIn";
import Proximate from "@/components/variable-proximity/Proximate";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function WhyCopy() {
  return (
    <MaskIn>
      <p className="mb-6 font-mono text-base leading-relaxed text-white md:text-lg">
        <Proximate>
          {`Since 2013, Omnia has been a place where we push ourselves to become someone we didn't know was possible before. A community training together and showing up for each other.`}
        </Proximate>
      </p>
      <p className="font-mono text-base leading-relaxed text-white md:text-lg">
        <Proximate>
          {`Omnia isn't for everyone but could be everything for you.`}
        </Proximate>
      </p>
    </MaskIn>
  );
}

export default function WhyOmnia() {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#why-omnia") return;
    const id = window.setTimeout(() => {
      document.getElementById("why-omnia")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  return (
    <section
      id="why-omnia"
      className="relative w-full min-h-[100dvh] md:h-screen md:min-h-0"
    >
      <Image
        src="/fam.jpg"
        alt="Omnia family"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/20 md:bg-transparent" aria-hidden />

      {/* Mobile: stacked under fixed logo */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-16 pt-28 md:hidden">
        <FadeIn>
          <Image
            src="/why.png"
            alt="Why Omnia?"
            width={300}
            height={200}
            className="h-auto w-[min(100%,220px)] object-contain"
          />
        </FadeIn>
        <div className="mt-10 max-w-lg">
          <FadeIn delay={80}>
            <WhyCopy />
          </FadeIn>
        </div>
      </div>

      {/* Desktop: split layout */}
      <div className="absolute inset-0 z-10 hidden md:block">
        <div className="absolute left-[22%] top-16">
          <FadeIn>
            <Image
              src="/why.png"
              alt="Why Omnia?"
              width={300}
              height={200}
              className="h-auto w-[300px] object-contain"
            />
          </FadeIn>
        </div>

        <div className="absolute right-24 top-1/2 max-w-sm -translate-y-1/2">
          <FadeIn>
            <WhyCopy />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
