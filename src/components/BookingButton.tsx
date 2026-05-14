"use client";

import MagneticButton from "@/components/MagneticButton";
import { useBooking } from "@/context/BookingContext";

const defaultClassName =
  "rounded-lg border border-black bg-pink-primary px-8 py-4 font-mono text-sm uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent md:text-base";

interface BookingButtonProps {
  children: React.ReactNode;
  /** Merged after default pink CTA styles; use to append only. */
  className?: string;
}

export default function BookingButton({
  children,
  className,
}: BookingButtonProps) {
  const { openModal } = useBooking();
  const merged = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <MagneticButton type="button" onClick={() => openModal()} className={merged}>
      {children}
    </MagneticButton>
  );
}
