"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type WelcomeModalContextValue = {
  isOpen: boolean;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
};

const WelcomeModalContext = createContext<WelcomeModalContextValue | null>(null);

export function WelcomeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWelcomeModal = useCallback(() => setIsOpen(true), []);
  const closeWelcomeModal = useCallback(() => setIsOpen(false), []);

  return (
    <WelcomeModalContext.Provider
      value={{ isOpen, openWelcomeModal, closeWelcomeModal }}
    >
      {children}
    </WelcomeModalContext.Provider>
  );
}

export function useWelcomeModal(): WelcomeModalContextValue {
  const ctx = useContext(WelcomeModalContext);
  if (!ctx) {
    throw new Error("useWelcomeModal must be used within WelcomeModalProvider");
  }
  return ctx;
}
