import { getMonthlyFinancialSummary } from "../services/transactions.service";
import SummaryWithToggle from "./summary-with-toggle";

export async function TransactionsSummaryCard({ month }: { month?: string }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const selectedMonth = month || currentMonth;
  const summaryData = (
    await getMonthlyFinancialSummary({ p_month: selectedMonth })
  )?.at(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="text-center mb-8">
      <SummaryWithToggle
        total_balance={formatCurrency(summaryData?.total_balance || 0)}
        income={formatCurrency(summaryData?.total_income_month || 0)}
        balance={formatCurrency(summaryData?.monthly_balance || 0)}
        expense={formatCurrency(summaryData?.total_expense_month || 0)}
      />
    </div>
  );
}