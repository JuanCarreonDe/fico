import { formatCurrency } from "@/lib/format-currency";
import { getMonthlyFinancialSummary, getSpendingProjection } from "../services/transactions.service";
import SummaryWithToggle from "./summary-with-toggle";
import { SpendingProjectionClient } from "./spending-projection-client";

export async function TransactionsSummaryCard({ month }: { month?: string }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const selectedMonth = month || currentMonth;
  const [summaryData, projectionData] = await Promise.all([
    getMonthlyFinancialSummary({ p_month: selectedMonth }).then((r) => r?.at(0)),
    getSpendingProjection(),
  ]);

  return (
    <div className="text-center mb-8">
      <SummaryWithToggle
        total_balance={formatCurrency(summaryData?.total_balance || 0)}
        income={formatCurrency(summaryData?.total_income_month || 0)}
        balance={formatCurrency(summaryData?.monthly_balance || 0)}
        expense={formatCurrency(summaryData?.total_expense_month || 0)}
      />
      {projectionData && <SpendingProjectionClient data={projectionData} />}
    </div>
  );
}
