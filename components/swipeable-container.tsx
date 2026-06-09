"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSwipe } from "@/lib/hooks/use-swipe";
import { setTransitionDirection } from "@/lib/transition-direction";

const pageOrder = ["/transactions", "/dashboard", "/settings"];

export function SwipeableContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handlers = useSwipe({
    onSwipeLeft: () => {
      const currentIndex = pageOrder.indexOf(pathname);
      if (currentIndex < pageOrder.length - 1) {
        setTransitionDirection("right");
        router.push(pageOrder[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      const currentIndex = pageOrder.indexOf(pathname);
      if (currentIndex > 0) {
        setTransitionDirection("left");
        router.push(pageOrder[currentIndex - 1]);
      }
    },
  });

  return (
    <div className="h-full" {...handlers}>
      {children}
    </div>
  );
}
