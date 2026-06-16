import MonthlyIncomeExpensesChart from "./monthly-income-expenses-chart";
import { getMonthlyIncomeExpenses } from "./dashboard.service";

export default async function MonthlyIncomeExpensesChartWrapper() {
  const data = await getMonthlyIncomeExpenses();
  return <MonthlyIncomeExpensesChart data={data ?? []} />;
}
