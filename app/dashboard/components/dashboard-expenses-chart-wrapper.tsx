import DashboardExpensesChart from "./dashboard-expenses-chart";
import { getDailySummaryByMonth } from "./dashboard.service";

interface DashboardExpensesChartWrapperProps {
  month?: string;
}

export default async function DashboardExpensesChartWrapper({
  month,
}: DashboardExpensesChartWrapperProps) {
  const dailySummaryData = await getDailySummaryByMonth({ p_month: month });

  return <DashboardExpensesChart dailySummaryData={dailySummaryData ?? []} />;
}
