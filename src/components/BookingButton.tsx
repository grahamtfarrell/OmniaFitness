"use client";

import { useBooking, type BookingFlow } from "@/context/BookingContext";

interface BookingButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Defaults to book intro (email + list). Use `talk-coach` for the coach contact form. */
  flow?: BookingFlow;
}

export default function BookingButton({
  children,
  className,
  flow = "book-intro",
}: BookingButtonProps) {
  const { openModal } = useBooking();

  return (
    <button type="button" onClick={() => openModal(flow)} className={className}>
      {children}
    </button>
  );
}
