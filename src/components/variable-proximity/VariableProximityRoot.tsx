"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

export const ProximityContainerContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function useProximityContainer(): RefObject<HTMLElement | null> | null {
  return useContext(ProximityContainerContext);
}

export function VariableProximityRoot({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ProximityContainerContext.Provider value={containerRef}>
      <div ref={containerRef} className="min-h-screen">
        {children}
      </div>
    </ProximityContainerContext.Provider>
  );
}
