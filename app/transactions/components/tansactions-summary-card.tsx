"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Receipt,
} from "lucide-react";
import { TransactionsMetricCard } from "./transactions-metric-card";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/lib/store/transaction-store";

interface FinancialSummaryCardProps {
  // summary: Database
  formatCurrency: (amount: number) => string;
}

export function TransactionsSummaryCard(
  {
    // formatCurrency,
  }: FinancialSummaryCardProps,
) {
  const summary = useTransactionStore((state) => state.summary)?.at(0);
  if (!summary) return;

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
        <div className="text-4xl font-bold text-primary mb-2">
          {/* {formatCurrency()} */}
          {summary?.total_balance}
        </div>
        <p className="text-sm text-muted-foreground">
          Balance total de todas las cuentas
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TransactionsMetricCard
          title="Ingresos"
          // value={formatCurrency(totalIncome)}
          value={summary?.total_income_month.toString()}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="income"
        />

        <TransactionsMetricCard
          title="Gastos"
          value={summary?.total_expense_month.toString()}
          icon={<ArrowDownRight className="w-4 h-4" />}
          variant="expense"
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
              summary?.monthly_balance >= 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {/* {formatCurrency(netBalance)} */}
            {summary?.monthly_balance}
          </div>
        </div>
      </div>
    </>
  );
}
