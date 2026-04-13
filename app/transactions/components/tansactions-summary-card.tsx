"use client";
import { ArrowUpRight, DollarSign, ArrowDownLeft, Scale } from "lucide-react";
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
          {isLoading && <Skeleton className="h-10 w-32" />}
          {!isLoading && formatCurrency(summary?.total_balance || 0)}
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
          title="Balance"
          value={formatCurrency(summary?.monthly_balance || 0)}
          icon={<Scale className="w-4 h-4 text-accent" />}
          variant="balance"
          isLoading={isLoading}
        />

        <TransactionsMetricCard
          title="Gastos"
          value={formatCurrency(summary?.total_expense_month || 0)}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="expense"
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
