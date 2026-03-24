"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Transactions", href: "/transactions" },
  // { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Settings", href: "/settings" },
];

export function NavigationMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center w-full min-h-12 p-2 rounded-2xl border bg-card">
      <div className="inline-flex justify-center items-center gap-2 h-full w-full px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "outline"}
              className={cn(
                "transition-all duration-200",
                isActive ? "bg-accent shadow-sm" : "hover:bg-background/50",
              )}
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
