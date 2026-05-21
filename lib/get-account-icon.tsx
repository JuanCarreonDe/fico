import {
  Landmark,
  Banknote,
  CreditCard,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

export const ACCOUNT_ICONS: Record<string, LucideIcon> = {
  bank: Landmark,
  cash: Banknote,
  credit: CreditCard,
  savings: PiggyBank,
};

export function getAccountIcon(type: string | null): LucideIcon {
  if (type && ACCOUNT_ICONS[type]) {
    return ACCOUNT_ICONS[type];
  }
  return Wallet;
}

export function AccountIconDisplay({
  type,
  className,
}: {
  type: string | null;
  className?: string;
}) {
  const Component = getAccountIcon(type);
  return createElement(Component, { className });
}
