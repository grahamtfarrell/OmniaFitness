"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type BookingFlow = "book-intro" | "talk-coach";

interface BookingContextType {
  isOpen: boolean;
  flow: BookingFlow;
  openModal: (flow?: BookingFlow) => void;
  closeModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [flow, setFlow] = useState<BookingFlow>("book-intro");

  const openModal = (nextFlow?: BookingFlow) => {
    const resolved: BookingFlow =
      nextFlow === "talk-coach" ? "talk-coach" : "book-intro";
    setFlow(resolved);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ isOpen, flow, openModal, closeModal }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
