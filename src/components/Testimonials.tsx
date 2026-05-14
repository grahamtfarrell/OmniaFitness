"use client";

import Image from "next/image";
import { useState } from "react";

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  image: string;
  subline: string;
};

const ITEMS: Testimonial[] = [
  {
    id: "austin",
    name: "Austin",
    quote:
      "At CrossFit Omnia, I've been pushed to grow and encouraged—not just by the coaches, but by the amazing community of fellow members.",
    image: "/testimonials/austin.jpg",
    subline: "Member at CrossFit Omnia",
  },
  {
    id: "riley",
    name: "Riley",
    quote:
      "Omnia is a place where fitness turns into friendship and friendship turns into family. The energy in this gym is truly next level!",
    image: "/testimonials/riley.jpg",
    subline: "Member at CrossFit Omnia",
  },
  {
    id: "tasha",
    name: "Tasha",
    quote:
      "Omnia was the first CrossFit gym I checked out in Denver, I did a drop in class and never looked back. This gym feels like my second home and it comes from Omnia's culture of support and community",
    image: "/testimonials/tasha.jpg",
    subline: "Member at CrossFit Omnia",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = ITEMS[index] ?? ITEMS[0];

  return (
    <section
      className="border-b border-black bg-white py-8 md:py-10"
      aria-label="Member testimonials"
    >
      <div className="mx-auto max-w-xl px-5 text-center md:px-6">
        <div
          key={active.id}
          id="testimonial-panel"
          role="tabpanel"
          aria-labelledby={`testimonial-tab-${active.id}`}
        >
          <blockquote className="m-0">
            <p className="font-mono text-[0.8125rem] font-normal leading-snug text-black md:text-sm md:leading-relaxed">
              <span className="text-black/35" aria-hidden>
                &ldquo;
              </span>
              {active.quote}
              <span className="text-black/35" aria-hidden>
                &rdquo;
              </span>
            </p>
          </blockquote>
        </div>

        <div
          className="mt-5 flex justify-center md:mt-6"
          role="tablist"
          aria-label="Choose member"
        >
          <div className="flex items-center justify-center">
            {ITEMS.map((item, i) => {
              const selected = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="testimonial-panel"
                  id={`testimonial-tab-${item.id}`}
                  aria-label={`Show ${item.name}'s testimonial`}
                  onClick={() => setIndex(i)}
                  className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-black bg-neutral-200 outline-none transition-[transform,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none md:h-[3.25rem] md:w-[3.25rem] ${
                    i > 0 ? "-ml-2.5 md:-ml-3" : ""
                  } ${selected ? "z-10 scale-[1.06] shadow-sm" : "z-0 opacity-[0.72] hover:opacity-100"}`}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover z-0"
                    sizes="52px"
                    aria-hidden
                  />
                  {selected ? (
                    <span
                      className="pointer-events-none absolute inset-0 z-[1] rounded-full bg-pink-primary/70 mix-blend-multiply"
                      aria-hidden
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 font-mono text-sm font-bold text-black md:text-base">
          {active.name}
        </p>
        <p className="mt-0.5 font-mono text-[0.6875rem] font-normal text-black/65 md:text-xs">
          {active.subline}
        </p>
      </div>
    </section>
  );
}
