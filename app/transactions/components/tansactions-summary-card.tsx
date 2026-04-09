"use client";
import { ArrowUpRight, DollarSign, ArrowDownLeft } from "lucide-react";
import { TransactionsMetricCard } from "./transactions-metric-card";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialSummaryCardProps {
  formatCurrency: (amount: number) => string;
}

export function TransactionsSummaryCard({
  formatCurrency,
}: FinancialSummaryCardProps) {
  const summary = useTransactionStore((state) => state.summary)?.at(0);

  const isLoading = useTransactionStore((state) => state.isLoading);

  return (
    <>
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-muted-foreground" />
          {isLoading && <Skeleton className="h-10 w-32" />}
          {!isLoading && summary?.total_balance}
        </div>
        <p className="text-sm text-muted-foreground">
          Balance total de todas las cuentas
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TransactionsMetricCard
          title="Ingresos"
          value={formatCurrency(summary?.total_income_month || 0)}
          icon={<ArrowDownLeft className="w-4 h-4" />}
          variant="income"
          isLoading={isLoading}
        />

        <TransactionsMetricCard
          title="Gastos"
          value={formatCurrency(summary?.total_expense_month || 0)}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="expense"
          isLoading={isLoading}
        />

        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Balance
            </span>
          </div>
          <div
            className={cn(
              "text font-bold",
              summary?.monthly_balance || 0 >= 0
                ? "text-green-600"
                : "text-red-600",
            )}
          >
            {isLoading && <Skeleton className="h-5 w-15" />}
            {!isLoading && formatCurrency(summary?.monthly_balance || 0)}
          </div>
        </div>
      </div>
    </>
  );
}
