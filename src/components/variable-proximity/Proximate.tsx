"use client";

import { type ReactNode } from "react";
import VariableProximity, {
  type VariableProximityProps,
} from "./VariableProximity";
import { useProximityContainer } from "./VariableProximityRoot";

function nodeToLabel(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeToLabel).join("");
  }
  return "";
}

export type ProximateProps = Omit<
  VariableProximityProps,
  "label" | "containerRef"
> & {
  children: ReactNode;
};

/**
 * Letter-level proximity effect; requires an ancestor {@link VariableProximityRoot}.
 * Renders plain text when used outside the provider.
 */
export default function Proximate(props: ProximateProps) {
  const { children, radius, falloff, maxScale, ...forward } = props;
  const label = nodeToLabel(children);
  const containerRef = useProximityContainer();

  if (!containerRef) {
    const { ...spanProps } = forward;
    return (
      <span {...spanProps}>
        {children}
      </span>
    );
  }

  return (
    <VariableProximity
      label={label}
      containerRef={containerRef}
      radius={radius}
      falloff={falloff}
      maxScale={maxScale}
      {...forward}
    />
  );
}
