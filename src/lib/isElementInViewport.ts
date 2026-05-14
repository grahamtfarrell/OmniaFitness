/** True if any part of the element intersects the visual viewport. */
export function isElementInViewport(el: HTMLElement): boolean {
  if (typeof window === "undefined") return false;
  const r = el.getBoundingClientRect();
  return (
    r.bottom > 0 &&
    r.top < window.innerHeight &&
    r.right > 0 &&
    r.left < window.innerWidth
  );
}
