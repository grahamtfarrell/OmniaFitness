"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";
import Proximate from "@/components/variable-proximity/Proximate";

export default function WhyOmnia() {
  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="/fam.jpg"
        alt="Omnia family"
        fill
        className="object-cover"
        priority
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0">
        {/* Left Side - Why Logo */}
        <div className="absolute top-12 left-[15%] md:top-16 md:left-[22%]">
          <FadeIn>
            <Image
              src="/why.png"
              alt="Why Omnia?"
              width={300}
              height={200}
              className="object-contain w-[200px] md:w-[300px]"
            />
          </FadeIn>
        </div>
        
        {/* Right Side - Text */}
        <div className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 max-w-xs md:max-w-sm">
          <FadeIn>
            <p className="text-white text-base md:text-lg font-mono leading-relaxed mb-6">
              <Proximate>
                {`Since 2013, Omnia has been a place where we push ourselves to become someone we didn't know was possible before. A community training together and showing up for each other.`}
              </Proximate>
            </p>
            <p className="text-white text-base md:text-lg font-mono leading-relaxed">
              <Proximate>
                {`Omnia isn't for everyone but could be everything for you.`}
              </Proximate>
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
