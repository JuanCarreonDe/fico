"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionStore } from "@/lib/store/transaction-store";

interface MetricCardProps {
  title?: string;
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
  const { isLoading } = useTransactionStore();

  const getVariantStyles = () => {
    switch (variant) {
      case "income":
        return "bg-green-50 dark:bg-green-950/20 text-green-600";
      case "expense":
        return "bg-red-50 dark:bg-red-950/20 text-red-600";
      case "balance":
        return "bg-accent/20 dark:bg-accent/20 text-accent";
      default:
        return "bg-gray-50 dark:bg-gray-950/20 text-gray-600";
    }
  };

  return (
    <div
      className={cn(
        "text-center p-4 rounded-lg flex flex-col items-center justify-center transition-opacity duration-300 animate-in fade-in",
        getVariantStyles(),
      )}
    >
      <div className="flex items-center justify-center gap-1 mb-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>

      {isLoading ? (
        <Skeleton className="h-6 w-full" />
      ) : (
        <div className="text font-bold">{value}</div>
      )}
    </div>
  );
}
