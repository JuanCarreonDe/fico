"use client";

import { TrendingUp } from "lucide-react";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SpendingProjectionClient({
  data,
}: {
  data: {
    avg_daily_expense: number;
    projected_end_balance: number;
    days_in_period: number;
    days_with_transactions: number;
    diff_vs_last_month: number;
    has_previous_month: boolean;
  };
}) {
  const { showAmounts } = useTransactionStore();
  const hidden = "******";

  if (data.days_with_transactions < 3) return null;

  const diffAbs = Math.abs(data.diff_vs_last_month);
  const isMore = data.diff_vs_last_month > 0;

  return (
    <div className="mt-3 py-3 border-y border-border text-left transition-opacity duration-300 animate-in fade-in">
      <div className="flex items-center gap-1.5 mb-1.5">
        <TrendingUp className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Proyección (últimos {data.days_in_period} días)
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Al ritmo actual (~{" "}
        <span className="font-semibold text-accent">
          {showAmounts ? formatCurrency(data.avg_daily_expense) : hidden}
        </span>
        /día), tu saldo al cierre del mes sería{" "}
        <span className="font-semibold text-foreground">
          {showAmounts ? formatCurrency(data.projected_end_balance) : hidden}
        </span>
        {data.has_previous_month && (
          <>
            .{" "}
            <span
              className={cn(
                "font-semibold",
                isMore ? "text-green-500" : "text-red-500",
              )}
            >
              {showAmounts ? formatCurrency(diffAbs) : hidden}
            </span>{" "}
            {isMore ? "más que" : "menos que"} el mes anterior
          </>
        )}
      </p>
    </div>
  );
}
