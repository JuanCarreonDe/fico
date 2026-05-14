import { getCategorySummary } from "./dashboard.service";
import { DashboardPieChart } from "./dashboard-pie-chart";

interface CategoryChartWrapperProps {
  month?: string;
}

export default async function CategoryChartWrapper({
  month,
}: CategoryChartWrapperProps) {
  const categoryData = await getCategorySummary({
    p_month: month,
    p_period: "month",
    p_type: "expense",
  });

  return (
    <DashboardPieChart categoryData={categoryData ?? []} month={month} />
  );
}