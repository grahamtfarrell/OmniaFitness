"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import FadeIn from "./FadeIn";

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
        const progress = scrollLeft / (scrollWidth - clientWidth);
        setScrollProgress(progress);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="bg-white py-16 md:py-24">
      {/* Section Header */}
      <div className="px-6 mb-8">
        <FadeIn>
          <h2 className="text-black text-2xl md:text-3xl font-mono tracking-wide">Join the crew</h2>
        </FadeIn>
      </div>

      {/* Product Cards - Horizontal Scroll */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <a
            key={index}
            href="https://omnia-fitness-collective.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[200px] md:w-[250px] group cursor-pointer"
          >
            {/* Badge - Above image */}
            {product.isNew && (
              <div className="flex justify-center mb-2">
                <span className="bg-[#FBCCF2] text-black text-xs font-mono px-2 py-0.5">
                  shirt
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
              $ {product.price.toFixed(2)}
            </p>
          </a>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 px-6">
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
