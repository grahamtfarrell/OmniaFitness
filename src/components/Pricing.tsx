"use client";

import FadeIn from "./FadeIn";

const tiers = [
  { label: "Unlimited", price: "$209/month" },
  { label: "3x/Week", price: "$189/Month" },
  { label: "10 Classes", price: "$185" },
  { label: "Drop Ins", price: "$30.00" },
];

export default function Pricing() {
  return (
    <section className="bg-white py-16 md:py-24 px-6">
      <FadeIn>
        <div className="max-w-md mx-auto">
          <h2 className="text-black text-center text-lg md:text-xl font-mono font-bold tracking-tight mb-10">
            Pricing
          </h2>
          <ul className="space-y-4 font-mono text-black text-sm md:text-base font-light">
            {tiers.map((row) => (
              <li
                key={row.label}
                className="flex justify-between gap-6 border-b border-black/10 pb-4 last:border-0"
              >
                <span>{row.label}</span>
                <span className="font-normal tabular-nums shrink-0">{row.price}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 pt-6 border-t border-black font-mono text-black text-sm md:text-base font-light flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
            <span>Personal Training</span>
            <span className="font-normal tabular-nums">Starting at $50</span>
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
