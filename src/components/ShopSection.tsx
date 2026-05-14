"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Proximate from "@/components/variable-proximity/Proximate";
import StaggerList from "./StaggerList";

// Placeholder products - will be replaced with Shopify data
const products = [
  {
    name: "Omnia Tee 1",
    price: 65.00,
    image: "/tee1.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 2",
    price: 65.00,
    image: "/tee2.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 3",
    price: 65.00,
    image: "/tee3.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 4",
    price: 65.00,
    image: "/tee4.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 1",
    price: 65.00,
    image: "/tee1.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 2",
    price: 65.00,
    image: "/tee2.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 3",
    price: 65.00,
    image: "/tee3.png",
    isNew: true,
  },
  {
    name: "Omnia Tee 4",
    price: 65.00,
    image: "/tee4.png",
    isNew: true,
  },
];

export default function ShopSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const max = scrollWidth - clientWidth;
        setScrollProgress(max > 0 ? scrollLeft / max : 0);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="bg-white py-10 md:py-14">
      {/* Product Cards - Horizontal Scroll */}
      <div
        ref={scrollRef}
        data-lenis-prevent-touch
        className="flex touch-pan-x gap-4 overflow-x-auto px-6 pb-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <StaggerList as="div" className="flex gap-4" staggerMs={36} durationMs={340}>
        {products.map((product, index) => (
          <a
            key={index}
            href="https://omnia-fitness-collective.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-lift-hover flex-shrink-0 w-[200px] md:w-[250px] group cursor-pointer rounded-sm"
          >
            {/* Badge - Above image */}
            {product.isNew && (
              <div className="flex justify-center mb-2">
                <span className="bg-[#FBCCF2] text-black text-xs font-mono px-2 py-0.5">
                  <Proximate>shirt</Proximate>
                </span>
              </div>
            )}
            {/* Product Image */}
            <div className="relative aspect-square w-full mb-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain group-hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Product Price */}
            <p className="text-black text-sm font-mono">
              <Proximate>{`$ ${product.price.toFixed(2)}`}</Proximate>
            </p>
          </a>
        ))}
        </StaggerList>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 px-6">
        <div className="h-0.5 bg-black/20">
          <div 
            className="h-0.5 bg-black transition-all duration-150"
            style={{ width: `${Math.max(20, scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
