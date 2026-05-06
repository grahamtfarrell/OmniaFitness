"use client";

import Link from "next/link";
import { useBooking } from "@/context/BookingContext";
import Proximate from "@/components/variable-proximity/Proximate";

export default function BlendNav() {
  const { openModal } = useBooking();

  return (
    <>
      {/* Desktop Nav - Fixed top left */}
      <div
        style={{
          position: "fixed",
          top: "72px",
          left: "24px",
          zIndex: 9998,
          mixBlendMode: "difference",
        }}
        className="hidden md:block"
      >
        <div className="flex items-center gap-3">
          <Link 
            href="/about" 
            className="text-white text-base font-mono tracking-wide hover:text-pink-primary transition-colors duration-300"
          >
            <Proximate>[about]</Proximate>
          </Link>
          <button
            type="button"
            onClick={() => openModal("book-intro")}
            className="text-white text-base font-mono tracking-wide hover:text-pink-primary transition-colors duration-300"
          >
            <Proximate>[book intro]</Proximate>
          </button>
          <a 
            href="https://omnia-fitness-collective.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-base font-mono tracking-wide hover:text-pink-primary transition-colors duration-300"
          >
            <Proximate>[shop]</Proximate>
          </a>
        </div>
      </div>

      {/* Mobile Nav - Fixed bottom bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-[9998]" style={{ mixBlendMode: "difference" }}>
        <div className="flex items-center justify-center gap-3">
          <Link 
            href="/about" 
            className="text-white text-base font-mono tracking-wide hover:text-pink-primary transition-colors duration-300"
          >
            <Proximate>[about]</Proximate>
          </Link>
          <button
            type="button"
            onClick={() => openModal("book-intro")}
            className="text-white text-base font-mono tracking-wide hover:text-pink-primary transition-colors duration-300"
          >
            <Proximate>[book intro]</Proximate>
          </button>
          <a 
            href="https://omnia-fitness-collective.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-base font-mono tracking-wide hover:text-pink-primary transition-colors duration-300"
          >
            <Proximate>[shop]</Proximate>
          </a>
        </div>
      </div>
    </>
  );
}
