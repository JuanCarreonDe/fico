"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Receipt,
  ArrowDownLeft,
} from "lucide-react";
import { TransactionsMetricCard } from "./transactions-metric-card";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialSummaryCardProps {
  // summary: Database
  formatCurrency: (amount: number) => string;
}

export function TransactionsSummaryCard({
  formatCurrency,
}: FinancialSummaryCardProps) {
  const summary = useTransactionStore((state) => state.summary)?.at(0);

  const isLoadingDailySummary = useTransactionStore(
    (state) => state.isLoadingDailySummary,
  );

  if (!summary) return;

  const {
    monthly_balance,
    total_balance,
    total_expense_month,
    total_income_month,
  } = summary;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Receipt className="w-6 h-6 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Saldo total</h2>
        </div>
        <Button variant="ghost" size="sm" className="p-2">
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
          {isLoadingDailySummary && <Skeleton className="h-10 w-32" />}
          {!isLoadingDailySummary && total_balance}
        </div>
        <p className="text-sm text-muted-foreground">
          Balance total de todas las cuentas
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TransactionsMetricCard
          title="Ingresos"
          value={formatCurrency(total_income_month)}
          // value={total_income_month.toString()}
          icon={<ArrowDownLeft className="w-4 h-4" />}
          variant="income"
          isLoadingDailySummary={isLoadingDailySummary}
        />

        <TransactionsMetricCard
          title="Gastos"
          value={formatCurrency(total_expense_month)}
          // value={total_expense_month.toString()}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="expense"
          isLoadingDailySummary={isLoadingDailySummary}
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
              monthly_balance >= 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {isLoadingDailySummary && <Skeleton className="h-5 w-15" />}
            {!isLoadingDailySummary && formatCurrency(monthly_balance)}
          </div>
        </div>
      </div>
    </>
  );
}
