let direction: "left" | "right" | null = null;

export function setTransitionDirection(d: "left" | "right") {
  direction = d;
}

export function getAndClearTransitionDirection() {
  const d = direction;
  direction = null;
  return d;
}
