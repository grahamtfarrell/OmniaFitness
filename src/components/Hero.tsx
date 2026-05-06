"use client";

import Image from "next/image";
import BookingButton from "./BookingButton";
import FadeIn from "./FadeIn";
import Proximate from "@/components/variable-proximity/Proximate";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/header.jpg"
          alt="Omnia Fitness"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Overlay — lower half; ~15vh offset down from midpoint */}
      <div className="relative z-10 flex h-full min-h-0 flex-col text-left">
        <div className="min-h-0 flex-1" aria-hidden />
        <div className="flex min-h-0 flex-1 flex-col justify-start px-[calc(2rem*0.4)] pb-10 pt-[15vh] md:px-[calc(4rem*0.4)] md:pb-14 lg:px-[calc(6rem*0.4)] xl:px-[calc(8rem*0.4)]">
          <FadeIn>
            <h1 className="mb-2 whitespace-nowrap font-mono text-[clamp(calc(1.125rem*0.8),calc((100vw-3.2rem)/14*0.8),calc(3.75rem*1.35*0.8))] leading-tight tracking-tight text-white md:mb-2.5">
              <Proximate>Show up. Be real. Get strong.</Proximate>
            </h1>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex w-full min-w-0 flex-col items-start gap-4 md:gap-5">
              <div className="max-w-full w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <p className="whitespace-nowrap text-left font-mono text-xs font-normal leading-none tracking-wide text-white/95 [paint-order:stroke_fill] [-webkit-text-stroke:0.55px_#fff] md:text-sm">
                  <Proximate>
                    [CrossFit, Functional Fitness, Hyrox, Personal Training, Performance Driven Results]
                  </Proximate>
                </p>
              </div>
              <BookingButton className="rounded-lg border-2 border-black bg-white px-8 py-4 font-mono text-base uppercase tracking-widest text-black transition-all duration-300 hover:border-pink-primary hover:bg-pink-primary hover:text-black md:text-lg">
                <Proximate>Book Intro</Proximate>
              </BookingButton>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
