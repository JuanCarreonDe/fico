"use client";

import { TouchEvent, useCallback, useRef } from "react";

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[role="dialog"], [role="listbox"], [role="combobox"]')) {
      return;
    }
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    const deltaX = e.touches[0].clientX - touchStart.current.x;
    const deltaY = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;
      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(deltaX) < threshold) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    },
    [threshold, onSwipeLeft, onSwipeRight],
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
}
