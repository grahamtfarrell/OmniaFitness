"use client";

import Image from "next/image";
import BookingButton from "./BookingButton";
import FadeIn from "./FadeIn";
import MaskIn from "./MaskIn";
import Proximate from "@/components/variable-proximity/Proximate";

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
        <MaskIn className="mb-8">
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono tracking-tight leading-tight">
            <Proximate>Your goals. Your lifestyle. Omnia.</Proximate>
          </h2>
        </MaskIn>

        <FadeIn delay={100}>
          <BookingButton>
            <Proximate>Talk to a Coach</Proximate>
          </BookingButton>
        </FadeIn>
      </div>
    </section>
  );
}
