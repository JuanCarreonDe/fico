import { ArrowUpRight, ArrowDownLeft, Scale } from "lucide-react";
import { TransactionsMetricCard } from "./transactions-metric-card";
import { getMonthlyFinancialSummary } from "../services/transactions.service";
import TransactionSummaryTotal from "./transaction-summary-total";

export async function TransactionsSummaryCard() {
  const summaryData = (await getMonthlyFinancialSummary())?.at(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="text-center mb-8">
        <TransactionSummaryTotal
          total_balance={formatCurrency(summaryData?.total_balance || 0)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TransactionsMetricCard
          title="Ingresos"
          value={formatCurrency(summaryData?.total_income_month || 0)}
          icon={<ArrowDownLeft className="w-4 h-4" />}
          variant="income"
        />

        <TransactionsMetricCard
          title="Balance"
          value={formatCurrency(summaryData?.monthly_balance || 0)}
          icon={<Scale className="w-4 h-4 text-accent" />}
          variant="balance"
        />

        <TransactionsMetricCard
          title="Gastos"
          value={formatCurrency(summaryData?.total_expense_month || 0)}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="expense"
        />
      </div>
    </>
  );
}
