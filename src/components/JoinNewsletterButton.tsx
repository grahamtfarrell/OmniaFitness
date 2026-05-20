"use client";

import type { ReactNode } from "react";
import Proximate from "@/components/variable-proximity/Proximate";
import { useWelcomeModal } from "@/context/WelcomeModalContext";

type JoinNewsletterButtonProps = {
  children: ReactNode;
  className?: string;
};

/** Opens the welcome / newsletter signup modal (same design as the homepage popup). */
export default function JoinNewsletterButton({
  children,
  className = "",
}: JoinNewsletterButtonProps) {
  const { openWelcomeModal } = useWelcomeModal();

  return (
    <button
      type="button"
      onClick={openWelcomeModal}
      className={className}
    >
      {typeof children === "string" ? <Proximate>{children}</Proximate> : children}
    </button>
  );
}
