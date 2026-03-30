"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  variant: "income" | "expense" | "balance";
}

export function TransactionsMetricCard({
  title,
  value,
  icon,
  variant,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "income":
        return "bg-green-50 dark:bg-green-950/20 text-green-600";
      case "expense":
        return "bg-red-50 dark:bg-red-950/20 text-red-600";
      case "balance":
        return "bg-blue-50 dark:bg-blue-950/20 text-blue-600";
      default:
        return "bg-gray-50 dark:bg-gray-950/20 text-gray-600";
    }
  };

  return (
    <div className={cn("text-center p-4 rounded-lg", getVariantStyles())}>
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="text font-bold">{value}</div>
    </div>
  );
}
