"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Transacciones", href: "/transactions", icon: ArrowLeftRight },
  { name: "Resumen", href: "/dashboard", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href;
}

export function NavigationMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center w-full min-h-12 p-2 rounded-2xl">
      <div className="flex justify-center items-center gap-2 h-full w-full px-2">
        {navigationItems.map((item) => {
          const isActive = isActiveRoute(pathname, item.href);
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "outline"}
              className={cn("flex-1 transition-all duration-200")}
            >
              <Link href={item.href} title={item.name}>
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.name}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
