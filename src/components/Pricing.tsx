"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";
import Proximate from "@/components/variable-proximity/Proximate";

const tiers = [
  { label: "Unlimited", price: "$209/month" },
  { label: "3x/Week", price: "$189/Month" },
  { label: "10 Classes", price: "$185" },
  { label: "Drop Ins", price: "$30.00" },
];

export default function Pricing() {
  return (
    <section className="relative overflow-hidden py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/bottom.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <FadeIn>
        <div className="relative z-10 mx-auto max-w-md px-6">
          <h2 className="mb-10 text-center font-mono text-lg font-bold tracking-tight text-white md:text-xl">
            <Proximate>Pricing</Proximate>
          </h2>
          <ul className="space-y-4 font-mono text-sm font-light text-white md:text-base">
            {tiers.map((row) => (
              <li
                key={row.label}
                className="flex justify-between gap-6 border-b border-white/25 pb-4 last:border-0"
              >
                <span>
                  <Proximate>{row.label}</Proximate>
                </span>
                <span className="shrink-0 font-normal tabular-nums">
                  <Proximate>{row.price}</Proximate>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 flex flex-col gap-1 border-t border-white/30 pt-6 font-mono text-sm font-light text-white md:flex-row md:items-baseline md:justify-between md:text-base">
            <span>
              <Proximate>Personal Training</Proximate>
            </span>
            <span className="font-normal tabular-nums">
              <Proximate>Starting at $50</Proximate>
            </span>
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
