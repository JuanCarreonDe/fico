"use client";

import { usePathname } from "next/navigation";
import { NavigationMenu } from "./navigation-menu";

export function NavigationWrapper() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") return null;

  return <NavigationMenu />;
}
