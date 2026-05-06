"use client";

import Image from "next/image";
import BookingButton from "./BookingButton";
import FadeIn from "./FadeIn";

export default function SplitSection() {
  return (
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/2nd.jpg"
          alt="Omnia Fitness"
          fill
          className="object-cover object-left md:object-center"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-16 md:pb-20 z-10">
        <FadeIn>
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono tracking-tight leading-tight mb-8">
            Your goals. Your lifestyle. Omnia
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <BookingButton className="border-2 border-white rounded-lg px-8 py-4 font-mono text-white text-base md:text-lg tracking-wide hover:bg-pink-primary hover:text-black hover:border-pink-primary transition-all duration-300">
            Talk to a Coach
          </BookingButton>
        </FadeIn>
      </div>
    </section>
  );
}
