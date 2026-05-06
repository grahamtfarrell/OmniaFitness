"use client";

import { useBooking } from "@/context/BookingContext";

interface BookingButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function BookingButton({ children, className }: BookingButtonProps) {
  const { openModal } = useBooking();

  return (
    <button onClick={openModal} className={className}>
      {children}
    </button>
  );
}
