import {
  UtensilsCrossed,
  Coffee,
  Wine,
  CakeSlice,
  Beer,
  Car,
  Bus,
  Fuel,
  Plane,
  Bike,
  Home,
  Plug,
  Droplets,
  Trash2,
  Sparkles,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Tags,
  HeartPulse,
  Pill,
  Dumbbell,
  Dog,
  Tv,
  Gamepad2,
  Music,
  Ticket,
  Briefcase,
  Landmark,
  Wallet,
  PiggyBank,
  TrendingDown,
  Smartphone,
  Laptop,
  BookOpen,
  Shirt,
  Baby,
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Coffee,
  Wine,
  CakeSlice,
  Beer,
  Car,
  Bus,
  Fuel,
  Plane,
  Bike,
  Home,
  Plug,
  Droplets,
  Trash2,
  Sparkles,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Tags,
  HeartPulse,
  Pill,
  Dumbbell,
  Dog,
  Tv,
  Gamepad2,
  Music,
  Ticket,
  Briefcase,
  Landmark,
  Wallet,
  PiggyBank,
  TrendingDown,
  Smartphone,
  Laptop,
  BookOpen,
  Shirt,
  Baby,
};

export type CategoryIconName = keyof typeof CATEGORY_ICONS;

export const CATEGORY_ICON_SECTIONS: {
  label: string;
  icons: CategoryIconName[];
}[] = [
  {
    label: "Comida y Bebida",
    icons: ["UtensilsCrossed", "Coffee", "Wine", "CakeSlice", "Beer"],
  },
  {
    label: "Transporte",
    icons: ["Car", "Bus", "Fuel", "Plane", "Bike"],
  },
  {
    label: "Hogar y Servicios",
    icons: ["Home", "Plug", "Droplets", "Trash2", "Sparkles"],
  },
  {
    label: "Compras",
    icons: ["ShoppingCart", "ShoppingBag", "Gift", "Tags"],
  },
  {
    label: "Salud y Bienestar",
    icons: ["HeartPulse", "Pill", "Dumbbell", "Dog"],
  },
  {
    label: "Entretenimiento",
    icons: ["Tv", "Gamepad2", "Music", "Ticket"],
  },
  {
    label: "Finanzas y Trabajo",
    icons: ["Briefcase", "Landmark", "Wallet", "PiggyBank", "TrendingDown"],
  },
  {
    label: "Otros",
    icons: ["Smartphone", "Laptop", "BookOpen", "Shirt", "Baby"],
  },
];

export function getCategoryIcon(
  iconName: string | null,
  type: "income" | "expense" | "transfer",
): LucideIcon {
  if (iconName && CATEGORY_ICONS[iconName]) {
    return CATEGORY_ICONS[iconName];
  }

  return type === "income" ? ArrowDownRight : ArrowUpRight;
}

export function CategoryIconDisplay({
  icon,
  type,
  className,
}: {
  icon: string | null;
  type: string;
  className?: string;
}) {
  const Component = icon && CATEGORY_ICONS[icon]
    ? CATEGORY_ICONS[icon]
    : (type === "income" ? ArrowDownRight : ArrowUpRight);
  return createElement(Component, { className });
}
