"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAndClearTransitionDirection } from "@/lib/transition-direction";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      const dir = getAndClearTransitionDirection();
      setDirection(dir);
      prevPathname.current = pathname;
      setKey(pathname);
    }
  }, [pathname]);

  const slideClass =
    direction === "left" ? "slide-in-from-left-4" :
    direction === "right" ? "slide-in-from-right-4" :
    "slide-in-from-bottom-4";

  return (
    <div key={key} className={`animate-in fade-in ${slideClass} duration-300`}>
      {children}
    </div>
  );
}
